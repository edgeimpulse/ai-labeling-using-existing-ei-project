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

import { OrganizationDataItem } from './organizationDataItem';

export class GetOrganizationDataItemResponseAllOf {
    'data': OrganizationDataItem;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "data",
            "baseName": "data",
            "type": "OrganizationDataItem"
        }    ];

    static getAttributeTypeMap() {
        return GetOrganizationDataItemResponseAllOf.attributeTypeMap;
    }
}

