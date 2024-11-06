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

export const getDifferences = <T extends { id: string }>(
    modelA: ApiModel<T, any>,
    modelB: ApiModel<T, any>
) => {
    const changes = new Set<keyof T>();
    Object.keys(modelA.props).forEach((key) => {
        if (notEqual(modelA.props[key], modelB.props[key])) {
            changes.add(key as keyof T);
        }
    });
    return changes;
};
