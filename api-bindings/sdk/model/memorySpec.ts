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

import { ResourceRange } from './resourceRange';

/**
* Describes performance characteristics of a particular memory type
*/
export class MemorySpec {
    'fastBytes'?: ResourceRange;
    'slowBytes'?: ResourceRange;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "fastBytes",
            "baseName": "fastBytes",
            "type": "ResourceRange"
        },
        {
            "name": "slowBytes",
            "baseName": "slowBytes",
            "type": "ResourceRange"
        }    ];

    static getAttributeTypeMap() {
        return MemorySpec.attributeTypeMap;
    }
}

