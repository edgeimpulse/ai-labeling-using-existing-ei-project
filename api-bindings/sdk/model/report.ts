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

import { JobCreatedByUser } from './jobCreatedByUser';

export class Report {
    'id': number;
    'created': Date;
    'createdByUser'?: JobCreatedByUser;
    'jobId': number;
    'jobFinished': boolean;
    'jobFinishedSuccessful': boolean;
    'downloadLink'?: string;
    'reportStartDate': Date;
    'reportEndDate': Date;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number"
        },
        {
            "name": "created",
            "baseName": "created",
            "type": "Date"
        },
        {
            "name": "createdByUser",
            "baseName": "createdByUser",
            "type": "JobCreatedByUser"
        },
        {
            "name": "jobId",
            "baseName": "jobId",
            "type": "number"
        },
        {
            "name": "jobFinished",
            "baseName": "jobFinished",
            "type": "boolean"
        },
        {
            "name": "jobFinishedSuccessful",
            "baseName": "jobFinishedSuccessful",
            "type": "boolean"
        },
        {
            "name": "downloadLink",
            "baseName": "downloadLink",
            "type": "string"
        },
        {
            "name": "reportStartDate",
            "baseName": "reportStartDate",
            "type": "Date"
        },
        {
            "name": "reportEndDate",
            "baseName": "reportEndDate",
            "type": "Date"
        }    ];

    static getAttributeTypeMap() {
        return Report.attributeTypeMap;
    }
}

