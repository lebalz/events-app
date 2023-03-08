import { action, computed } from "mobx";
import _ from 'lodash';

export default class ApiModel<T extends { id: string }> {
    _pristine: T;

    @action
    save() {
        throw new Error('Not implemented');
    }

    @action
    destroy() {
        throw new Error('Not implemented');
    }

    @computed
    get props(): T {
        throw new Error('Not implemented');
    }

    @computed
    get dirtyProps(): Partial<T> {
        /**
         * return the props that have changed since the last save
         */
        throw new Error('Not implemented');
    }

    @action
    update(props: Partial<T>) {
        throw new Error('Not implemented');
    }

    @computed
    get isDirty(): boolean {
        throw new Error('Not implemented');
    }

    @action
    reset() {
        throw new Error('Not implemented');
    }

}