import _ from 'lodash';
import ApiModel from './ApiModel';

export const notEqual = (a: any, b: any) => {
    if (Array.isArray(a)) {
        if (_.xor(a, b).length !== 0) {
            return true;
        }
    } else if (a !== b) {
        return true;
    }
};

export const getChanges = <T extends { id: string }>(model: ApiModel<T>) => {
    const { _pristine, props } = model;
    const changes: Partial<T> = {};
    Object.keys(props).forEach((key) => {
        if (notEqual(props[key], _pristine[key])) {
            changes[key] = props[key];
        }
    });
    return changes;
};
