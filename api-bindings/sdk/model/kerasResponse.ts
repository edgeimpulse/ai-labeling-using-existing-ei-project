/**
 * Edge Impulse API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { AkidaEdgeLearningConfig } from './akidaEdgeLearningConfig';
import { AnomalyCapacity } from './anomalyCapacity';
import { AugmentationPolicyImageEnum } from './augmentationPolicyImageEnum';
import { AugmentationPolicySpectrogram } from './augmentationPolicySpectrogram';
import { BlockParameters } from './blockParameters';
import { DependencyData } from './dependencyData';
import { GenericApiResponse } from './genericApiResponse';
import { KerasConfig } from './kerasConfig';
import { KerasModelTypeEnum } from './kerasModelTypeEnum';
import { KerasModelVariantEnum } from './kerasModelVariantEnum';
import { KerasVisualLayer } from './kerasVisualLayer';
import { LearnBlockType } from './learnBlockType';
import { ModelEngineShortEnum } from './modelEngineShortEnum';
import { TransferLearningModel } from './transferLearningModel';

export class KerasResponse {
    /**
    * Whether the operation succeeded
    */
    'success': boolean;
    /**
    * Optional error description (set if \'success\' was false)
    */
    'error'?: string;
    'dependencies': DependencyData;
    /**
    * Whether the block is trained
    */
    'trained': boolean;
    'name': string;
    'type'?: LearnBlockType;
    /**
    * The Keras script. This script might be empty if the mode is visual.
    */
    'script': string;
    /**
    * Minimum confidence rating required for the neural network. Scores below this confidence are tagged as uncertain.
    */
    'minimumConfidenceRating': number;
    'selectedModelType': KerasModelTypeEnum;
    /**
    * The mode (visual or expert) to use for editing this network.
    */
    'mode': KerasResponseModeEnum;
    /**
    * The visual layers (if in visual mode) for the neural network. This will be an empty array when in expert mode.
    */
    'visualLayers': Array<KerasVisualLayer>;
    /**
    * Number of training cycles. If in expert mode this will be 0.
    */
    'trainingCycles': number;
    /**
    * Learning rate (between 0 and 1). If in expert mode this will be 0.
    */
    'learningRate': number;
    /**
    * The batch size used during training.
    */
    'batchSize'?: number;
    /**
    * The default batch size if a value is not configured.
    */
    'defaultBatchSize': number;
    /**
    * Python-formatted tuple of input axes
    */
    'shape': string;
    /**
    * Train/test split (between 0 and 1)
    */
    'trainTestSplit'?: number;
    /**
    * Whether to automatically balance class weights, use this for skewed datasets.
    */
    'autoClassWeights'?: boolean;
    /**
    * Use learned optimizer and ignore learning rate.
    */
    'useLearnedOptimizer'?: boolean;
    'augmentationPolicyImage': AugmentationPolicyImageEnum;
    'augmentationPolicySpectrogram'?: AugmentationPolicySpectrogram;
    'transferLearningModels': Array<TransferLearningModel>;
    /**
    * Whether to profile the i8 model (might take a very long time)
    */
    'profileInt8': boolean;
    /**
    * If set, skips creating embeddings and measuring memory (used in tests)
    */
    'skipEmbeddingsAndMemory': boolean;
    'akidaEdgeLearningConfig'?: AkidaEdgeLearningConfig;
    /**
    * This metadata key is used to prevent group data leakage between train and validation datasets.
    */
    'customValidationMetadataKey'?: string;
    /**
    * Whether the \'Advanced training settings\' UI element should be expanded.
    */
    'showAdvancedTrainingSettings': boolean;
    /**
    * Whether the \'Augmentation training settings\' UI element should be expanded.
    */
    'showAugmentationTrainingSettings': boolean;
    /**
    * Training parameters, this list depends on the list of parameters that the model exposes.
    */
    'customParameters'?: { [key: string]: string; };
    'anomalyCapacity'?: AnomalyCapacity;
    'lastShownModelVariant'?: KerasModelVariantEnum;
    'lastShownModelEngine'?: ModelEngineShortEnum;
    'blockParameters'?: BlockParameters;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "success",
            "baseName": "success",
            "type": "boolean"
        },
        {
            "name": "error",
            "baseName": "error",
            "type": "string"
        },
        {
            "name": "dependencies",
            "baseName": "dependencies",
            "type": "DependencyData"
        },
        {
            "name": "trained",
            "baseName": "trained",
            "type": "boolean"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "type",
            "baseName": "type",
            "type": "LearnBlockType"
        },
        {
            "name": "script",
            "baseName": "script",
            "type": "string"
        },
        {
            "name": "minimumConfidenceRating",
            "baseName": "minimumConfidenceRating",
            "type": "number"
        },
        {
            "name": "selectedModelType",
            "baseName": "selectedModelType",
            "type": "KerasModelTypeEnum"
        },
        {
            "name": "mode",
            "baseName": "mode",
            "type": "KerasResponseModeEnum"
        },
        {
            "name": "visualLayers",
            "baseName": "visualLayers",
            "type": "Array<KerasVisualLayer>"
        },
        {
            "name": "trainingCycles",
            "baseName": "trainingCycles",
            "type": "number"
        },
        {
            "name": "learningRate",
            "baseName": "learningRate",
            "type": "number"
        },
        {
            "name": "batchSize",
            "baseName": "batchSize",
            "type": "number"
        },
        {
            "name": "defaultBatchSize",
            "baseName": "defaultBatchSize",
            "type": "number"
        },
        {
            "name": "shape",
            "baseName": "shape",
            "type": "string"
        },
        {
            "name": "trainTestSplit",
            "baseName": "trainTestSplit",
            "type": "number"
        },
        {
            "name": "autoClassWeights",
            "baseName": "autoClassWeights",
            "type": "boolean"
        },
        {
            "name": "useLearnedOptimizer",
            "baseName": "useLearnedOptimizer",
            "type": "boolean"
        },
        {
            "name": "augmentationPolicyImage",
            "baseName": "augmentationPolicyImage",
            "type": "AugmentationPolicyImageEnum"
        },
        {
            "name": "augmentationPolicySpectrogram",
            "baseName": "augmentationPolicySpectrogram",
            "type": "AugmentationPolicySpectrogram"
        },
        {
            "name": "transferLearningModels",
            "baseName": "transferLearningModels",
            "type": "Array<TransferLearningModel>"
        },
        {
            "name": "profileInt8",
            "baseName": "profileInt8",
            "type": "boolean"
        },
        {
            "name": "skipEmbeddingsAndMemory",
            "baseName": "skipEmbeddingsAndMemory",
            "type": "boolean"
        },
        {
            "name": "akidaEdgeLearningConfig",
            "baseName": "akidaEdgeLearningConfig",
            "type": "AkidaEdgeLearningConfig"
        },
        {
            "name": "customValidationMetadataKey",
            "baseName": "customValidationMetadataKey",
            "type": "string"
        },
        {
            "name": "showAdvancedTrainingSettings",
            "baseName": "showAdvancedTrainingSettings",
            "type": "boolean"
        },
        {
            "name": "showAugmentationTrainingSettings",
            "baseName": "showAugmentationTrainingSettings",
            "type": "boolean"
        },
        {
            "name": "customParameters",
            "baseName": "customParameters",
            "type": "{ [key: string]: string; }"
        },
        {
            "name": "anomalyCapacity",
            "baseName": "anomalyCapacity",
            "type": "AnomalyCapacity"
        },
        {
            "name": "lastShownModelVariant",
            "baseName": "lastShownModelVariant",
            "type": "KerasModelVariantEnum"
        },
        {
            "name": "lastShownModelEngine",
            "baseName": "lastShownModelEngine",
            "type": "ModelEngineShortEnum"
        },
        {
            "name": "blockParameters",
            "baseName": "blockParameters",
            "type": "BlockParameters"
        }    ];

    static getAttributeTypeMap() {
        return KerasResponse.attributeTypeMap;
    }
}


export type KerasResponseModeEnum = 'visual' | 'expert';
export const KerasResponseModeEnumValues: string[] = ['visual', 'expert'];
