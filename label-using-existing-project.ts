import fs from 'fs';
import Path from 'path';
import program from 'commander';
import { EdgeImpulseApi } from './api-bindings';
import * as models from './api-bindings/sdk/model/models';
import asyncPool from 'tiny-async-pool';

const packageVersion = (<{ version: string }>JSON.parse(fs.readFileSync(
    Path.join(__dirname, '..', 'package.json'), 'utf-8'))).version;

if (!process.env.EI_PROJECT_API_KEY) {
    console.log('Missing EI_PROJECT_API_KEY');
    process.exit(1);
}

let API_URL = process.env.EI_API_ENDPOINT || 'https://studio.edgeimpulse.com/v1';
const API_KEY = process.env.EI_PROJECT_API_KEY;

API_URL = API_URL.replace('/v1', '');

program
    .description('Label data using an existing Edge Impulse project ' + packageVersion)
    .version(packageVersion)
    .requiredOption('--source-project-api-key <api-key>', 'API key of the project you want to use to label with')
    .option('--source-project-impulse-id <impulse-id>', 'Optional impulse ID for the source project')
    .option('--delete-existing-bounding-boxes', 'Delete existing bounding boxes (if present)')
    .option('--keep-bounding-boxes <map>',
        `If this field is filled, only bounding boxes in this field are returned (only applies to object detection datasets). ` +
        `E.g.: bottle, person discards any other bounding boxes. To remap add the remapped label in parenthesis e.g. 'bottle (beer)'`)
    .requiredOption('--data-ids-file <file>', 'File with IDs (as JSON)')
    .option('--propose-actions <job-id>', 'If this flag is passed in, only propose suggested actions')
    .option('--verbose', 'Enable debug logs')
    .allowUnknownOption(true)
    .parse(process.argv);

const api = new EdgeImpulseApi({ endpoint: API_URL });
const sourceProjectApi = new EdgeImpulseApi({ endpoint: API_URL });

const sourceProjectApiKeyArgv = <string>program.sourceProjectApiKey;
const sourceProjectImpulseIdArgv = program.sourceProjectImpulseId ? Number(program.sourceProjectImpulseId) : 1;
const dataIdsFile = <string>program.dataIdsFile;
const proposeActionsJobId = program.proposeActions ?
    Number(program.proposeActions) :
    undefined;
const deleteExistingBbs = <boolean>program.deleteExistingBoundingBoxes;

let keepBoundingBoxes: Map<string, string> | undefined;
if (program.keepBoundingBoxes) {
    keepBoundingBoxes = new Map();

    // the replacement looks weird; but if calling this from CLI like
    // "--prompt 'test\nanother line'" we'll get this still escaped
    // (you could use $'test\nanotherline' but we won't do that in the Edge Impulse backend)
    const keepBoundingBoxesArgv = (<string>program.keepBoundingBoxes).replaceAll('\\n', '\n');

    for (let entry of keepBoundingBoxesArgv.split(/[\n|,]/g)) {
        entry = entry.trim();
        if (entry.indexOf('(') > -1) {
            let m = entry.match(/(.*?)\((.*?)\)$/);
            if (!m || m.length < 2) {
                console.log(`Failed to parse --keep-bounding-boxes: Cannot parse entry "${entry}".`);
                process.exit(1);
            }
            let [ _, currLabel, newLabel ] = m;
            keepBoundingBoxes.set(currLabel.toLowerCase().trim(), newLabel.trim());
        }
        else {
            keepBoundingBoxes.set(entry.toLowerCase(), entry.toLowerCase());
        }
    }
}
if (proposeActionsJobId && isNaN(proposeActionsJobId)) {
    console.log('--propose-actions should be numeric');
    process.exit(1);
}
if (sourceProjectImpulseIdArgv && isNaN(sourceProjectImpulseIdArgv)) {
    console.log('--source-project-impulse-id should be numeric');
    process.exit(1);
}
let dataIds: number[] | undefined;
if (!fs.existsSync(dataIdsFile)) {
    console.log(`"${dataIdsFile}" does not exist (via --data-ids-file)`);
    process.exit(1);
}
try {
    dataIds = <number[]>JSON.parse(fs.readFileSync(dataIdsFile, 'utf-8'));
    if (!Array.isArray(dataIds)) {
        throw new Error('Content of the file is not an array');
    }
    for (let ix = 0; ix < dataIds.length; ix++) {
        if (isNaN(dataIds[ix])) {
            throw new Error('The value at index ' + ix + ' is not numeric');
        }
    }
}
catch (ex2) {
    console.log(`Failed to parse "${dataIdsFile}" (via --data-ids-file), should be a JSON array with numbers`, ex2);
    process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    try {
        await api.authenticate({
            method: 'apiKey',
            apiKey: API_KEY,
        });
        await sourceProjectApi.authenticate({
            method: 'apiKey',
            apiKey: sourceProjectApiKeyArgv,
        });

        // listProjects returns a single project if authenticated by API key
        const project = (await api.projects.listProjects()).projects[0];
        const sourceProject = (await sourceProjectApi.projects.listProjects()).projects[0];

        console.log(`Labeling data in "${project.owner} / ${project.name}" using model from "${sourceProject.owner} / ${sourceProject.name}"`);
        if (keepBoundingBoxes) {
            console.log('    Bounding boxes to keep:');
            for (let [ label, newLabel ] of keepBoundingBoxes.entries()) {
                if (label === newLabel) {
                    console.log(`        - ${label}`);
                }
                else {
                    console.log(`        - ${label} (remap to ${newLabel})`);
                }
            }
        }
        if (dataIds.length < 6) {
            console.log(`    IDs: ${dataIds.join(', ')}`);
        }
        else {
            console.log(`    IDs: ${dataIds.slice(0, 5).join(', ')} and ${dataIds.length - 5} others`);
        }
        console.log(``);

        if (project.labelingMethod !== sourceProject.labelingMethod) {
            throw new Error(`Labeling method differs between projects (source project: ${sourceProject.labelingMethod}, ` +
                `target project: ${project.labelingMethod}). Both projects need to have the same labeling method.`);
        }

        // try and get the impulse, so we error out if the impulse is not there
        await sourceProjectApi.impulse.getImpulse(sourceProject.id, {
            impulseId: sourceProjectImpulseIdArgv
        });

        let samplesToProcess: models.Sample[];

        console.log(`Finding data by ID...`);
        samplesToProcess = await listDataByIds(project.id, dataIds);
        console.log(`Finding data by ID OK (found ${samplesToProcess.length} samples)`);
        console.log(``);

        samplesToProcess = samplesToProcess.sort((a, b) => a.id - b.id);

        const total = samplesToProcess.length;
        let processed = 0;
        let notAnImage = 0;
        let error = 0;

        const getSummary = () => {
            return `(error=${error})`;
        };

        let updateIv = setInterval(async () => {
            let currFile = (processed).toString().padStart(total.toString().length, ' ');
            console.log(`[${currFile}/${total}] Labeling samples... ` +
                getSummary());
        }, 3000);

        const labelSample = async (sample: models.Sample) => {
            if (sample.chartType !== 'image') {
                let currFile = (processed).toString().padStart(total.toString().length, ' ');
                console.log(`[${currFile}/${total}] WARN: Cannot label ${sample.filename} (ID: ${sample.id}): This action block only supports images`);
                notAnImage++;
                processed++;
                return;
            }

            try {
                const classifyRes = await retryWithTimeout(async () => {
                    const imgData = await api.rawData.getSampleAsImage(project.id, sample.id, { });
                    return await sourceProjectApi.classify.classifyImage(sourceProject.id, {
                        image: {
                            options: {
                                contentType: 'image/jpeg',
                                filename: 'test.jpg'
                            },
                            value: imgData,
                        },
                    }, {
                        impulseId: sourceProjectImpulseIdArgv,
                    });
                }, {
                    fnName: 'classifyImage',
                    maxRetries: 3,
                    onWarning: (retriesLeft, ex) => {
                        let currFile = (processed).toString().padStart(total.toString().length, ' ');
                        console.log(`[${currFile}/${total}] WARN: Failed to label ${sample.filename} (ID: ${sample.id}): ${ex.message || ex.toString()}. Retries left=${retriesLeft}`);
                    },
                    onError: (ex) => {
                        let currFile = (processed).toString().padStart(total.toString().length, ' ');
                        console.log(`[${currFile}/${total}] ERR: Failed to label ${sample.filename} (ID: ${sample.id}): ${ex.message || ex.toString()}.`);
                    },
                    timeoutMs: 30000,
                });

                await retryWithTimeout(async () => {
                    if (classifyRes.boundingBoxes) {
                        let newBbs: models.BoundingBox[] = [];
                        if (!deleteExistingBbs) {
                            newBbs = sample.boundingBoxes;
                        }

                        for (let bb of classifyRes.boundingBoxes) {
                            if (keepBoundingBoxes) {
                                const newLabel = keepBoundingBoxes.get(bb.label.toLowerCase());

                                if (!newLabel) {
                                    continue;
                                }

                                if (bb.label.toLowerCase() !== newLabel.toLowerCase()) {
                                    bb.label = newLabel;
                                }
                                newBbs.push(bb);
                            }
                            else {
                                newBbs.push(bb);
                            }
                        }

                        // dry-run, only propose?
                        if (proposeActionsJobId) {
                            await api.rawData.setSampleProposedChanges(project.id, sample.id, {
                                jobId: proposeActionsJobId,
                                proposedChanges: {
                                    boundingBoxes: newBbs,
                                }
                            });
                        }
                        // actually perform actions
                        else {
                            await api.rawData.setSampleBoundingBoxes(project.id, sample.id, {
                                boundingBoxes: newBbs,
                            });
                        }
                    }
                    else if (classifyRes.result) {
                        let highestValue = Math.max(...Object.values(classifyRes.result));
                        let highestLabel =
                            Object.keys(classifyRes.result)[Object.values(classifyRes.result).indexOf(highestValue)];

                        // dry-run, only propose?
                        if (proposeActionsJobId) {
                            await api.rawData.setSampleProposedChanges(project.id, sample.id, {
                                jobId: proposeActionsJobId,
                                proposedChanges: {
                                    label: highestLabel,
                                }
                            });
                        }
                        // actually perform actions
                        else {
                            await api.rawData.editLabel(project.id, sample.id, {
                                label: highestLabel,
                            });
                        }
                    }
                }, {
                    fnName: 'edgeimpulse.api',
                    maxRetries: 3,
                    timeoutMs: 60000,
                    onWarning: (retriesLeft, ex) => {
                        let currFile = (processed).toString().padStart(total.toString().length, ' ');
                        console.log(`[${currFile}/${total}] WARN: Failed to update ${sample.filename} (ID: ${sample.id}): ${ex.message || ex.toString()}. Retries left=${retriesLeft}`);
                    },
                    onError: (ex) => {
                        let currFile = (processed).toString().padStart(total.toString().length, ' ');
                        console.log(`[${currFile}/${total}] ERR: Failed to update ${sample.filename} (ID: ${sample.id}): ${ex.message || ex.toString()}.`);
                    },
                });
            }
            catch (ex2) {
                let ex = <Error>ex2;
                let currFile = (processed + 1).toString().padStart(total.toString().length, ' ');
                console.log(`[${currFile}/${total}] Failed to label sample "${sample.filename}" (ID: ${sample.id}): ` +
                    (ex.message || ex.toString()));
                error++;
            }
            finally {
                processed++;
            }
        };

        try {
            console.log(`Labeling ${total.toLocaleString()} samples...`);

            await asyncPool(10, samplesToProcess.slice(0, total), labelSample);

            clearInterval(updateIv);

            console.log(`[${total}/${total}] Labeling samples... ` + getSummary());
            console.log(`Done labeling samples, goodbye!`);
        }
        finally {
            clearInterval(updateIv);
        }
    }
    catch (ex2) {
        let ex = <Error>ex2;
        console.log('Failed to label data:', ex.message || ex.toString());
        process.exit(1);
    }

    process.exit(0);
})();

async function listDataByIds(projectId: number, ids: number[]) {
    const limit = 1000;
    let offset = 0;
    let allSamples: models.Sample[] = [];

    let iv = setInterval(() => {
        console.log(`Still finding data (found ${allSamples.length} samples)...`);
    }, 3000);

    try {
        while (1) {
            let ret = await api.rawData.listSamples(projectId, {
                category: 'training',
                labels: '',
                offset: offset,
                limit: limit,
            });
            if (ret.samples.length === 0) {
                break;
            }
            for (let s of ret.samples) {
                if (ids.indexOf(s.id) !== -1) {
                    allSamples.push(s);
                }
            }
            offset += limit;
        }

        offset = 0;
        while (1) {
            let ret = await api.rawData.listSamples(projectId, {
                category: 'testing',
                labels: '',
                offset: offset,
                limit: limit,
            });
            if (ret.samples.length === 0) {
                break;
            }
            for (let s of ret.samples) {
                if (ids.indexOf(s.id) !== -1) {
                    allSamples.push(s);
                }
            }
            offset += limit;
        }
    }
    finally {
        clearInterval(iv);
    }
    return allSamples;
}

export async function retryWithTimeout<T>(fn: () => Promise<T>, opts: {
    fnName: string,
    timeoutMs: number,
    maxRetries: number,
    onWarning: (retriesLeft: number, ex: Error) => void,
    onError: (ex: Error) => void,
}) {
    const { timeoutMs, maxRetries, onWarning, onError } = opts;

    let retriesLeft = maxRetries;

    let ret: T;

    while (1) {
        try {
            ret = await new Promise<T>(async (resolve, reject) => {
                let timeout = setTimeout(() => {
                    reject(opts.fnName + ' did not return within ' + timeoutMs + 'ms.');
                }, timeoutMs);

                try {
                    const b = await fn();

                    resolve(b);
                }
                catch (ex) {
                    reject(ex);
                }
                finally {
                    clearTimeout(timeout);
                }
            });

            break;
        }
        catch (ex2) {
            let ex = <Error>ex2;

            retriesLeft = retriesLeft - 1;
            if (retriesLeft === 0) {
                onError(ex);
                throw ex2;
            }

            onWarning(retriesLeft, ex);
        }
    }

    return ret!;
}
