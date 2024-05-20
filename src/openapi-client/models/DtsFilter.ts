/* tslint:disable */
/* eslint-disable */
/**
 * dashboard-backend API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { EntityState } from './EntityState';
import {
    EntityStateFromJSON,
    EntityStateFromJSONTyped,
    EntityStateToJSON,
} from './EntityState';

/**
 * 
 * @export
 * @interface DtsFilter
 */
export interface DtsFilter {
    /**
     * 
     * @type {string}
     * @memberof DtsFilter
     */
    name?: string;
    /**
     * 
     * @type {EntityState}
     * @memberof DtsFilter
     */
    state?: EntityState;
    /**
     * 
     * @type {boolean}
     * @memberof DtsFilter
     */
    showDeleted?: boolean;
    /**
     * 
     * @type {string}
     * @memberof DtsFilter
     */
    searchAttribute?: string;
    /**
     * 
     * @type {Array<EntityState>}
     * @memberof DtsFilter
     */
    includeStates?: Array<EntityState>;
    /**
     * 
     * @type {Array<EntityState>}
     * @memberof DtsFilter
     */
    excludeStates?: Array<EntityState>;
}

/**
 * Check if a given object implements the DtsFilter interface.
 */
export function instanceOfDtsFilter(value: object): boolean {
    return true;
}

export function DtsFilterFromJSON(json: any): DtsFilter {
    return DtsFilterFromJSONTyped(json, false);
}

export function DtsFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): DtsFilter {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'state': json['state'] == null ? undefined : EntityStateFromJSON(json['state']),
        'showDeleted': json['showDeleted'] == null ? undefined : json['showDeleted'],
        'searchAttribute': json['searchAttribute'] == null ? undefined : json['searchAttribute'],
        'includeStates': json['includeStates'] == null ? undefined : ((json['includeStates'] as Array<any>).map(EntityStateFromJSON)),
        'excludeStates': json['excludeStates'] == null ? undefined : ((json['excludeStates'] as Array<any>).map(EntityStateFromJSON)),
    };
}

export function DtsFilterToJSON(value?: DtsFilter | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'name': value['name'],
        'state': EntityStateToJSON(value['state']),
        'showDeleted': value['showDeleted'],
        'searchAttribute': value['searchAttribute'],
        'includeStates': value['includeStates'] == null ? undefined : ((value['includeStates'] as Array<any>).map(EntityStateToJSON)),
        'excludeStates': value['excludeStates'] == null ? undefined : ((value['excludeStates'] as Array<any>).map(EntityStateToJSON)),
    };
}

