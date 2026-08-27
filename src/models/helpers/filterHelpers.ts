import _ from 'es-toolkit/compat';

export const rmUndefined = <T>(list: (T | undefined)[]) => {
    return _.reject(list, _.isUndefined) as T[];
};
