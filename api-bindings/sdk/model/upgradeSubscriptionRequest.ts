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

import { BillingCycle } from './billingCycle';

export class UpgradeSubscriptionRequest {
    'billingCycle': BillingCycle;
    /**
    * URL to redirect the user to after a successful checkout process.
    */
    'successUrl': string;
    /**
    * URL to redirect the user to after the checkout process is canceled.
    */
    'cancelUrl': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "billingCycle",
            "baseName": "billingCycle",
            "type": "BillingCycle"
        },
        {
            "name": "successUrl",
            "baseName": "successUrl",
            "type": "string"
        },
        {
            "name": "cancelUrl",
            "baseName": "cancelUrl",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return UpgradeSubscriptionRequest.attributeTypeMap;
    }
}

