import { action, computed, IObservableArray, makeObservable } from "mobx";
import _ from 'lodash';
import iStore from "../stores/iStore";

const notEqual = (a: any, b: any) => {
    if (Array.isArray(a)) {
        if (_.xor(a, b).length !== 0) {
            return true;
        }
    } else if (a !== b) {
        return true;
    }
}
export default abstract class ApiModel<T extends { id: string }> {
    abstract readonly _pristine: T;
    abstract readonly store: iStore<T>;
    abstract readonly id: string;
    abstract readonly UPDATEABLE_PROPS: (keyof T)[];

    constructor() {
        makeObservable(this);
    }

    @computed
    get props(): T {
        throw new Error('Not implemented');
    }

    @computed
    get pristine(): T {
        return this._pristine;
    }

    @computed
    get dirtyProps(): Partial<T> {
        const { _pristine, props } = this;
        const changes: Partial<T> = {};
        Object.keys(props).forEach(key => {
            if (notEqual(props[key], _pristine[key])) {
                changes[key] = props[key];
            }
        });
        return changes;
    }
    
    @computed
    get isDirty(): boolean {
        return Object.keys(this.dirtyProps).length > 0;
    }

    @action
    reset() {
        return this.update(this.pristine);
    }

    @action
    update(props: Partial<T>) {
        this.UPDATEABLE_PROPS.forEach(key => {
            if (key in props) {
                if (Array.isArray(props[key])) {
                    ((this as any)[key] as IObservableArray<T>).replace(props[key] as T[]);
                } else {
                    Object.assign(this, { [key]: props[key] });
                }
            }
        });
        return this.dirtyProps;
    }

    @action
    save() {
        return this.store.save(this);
    }

    @action
    destroy() {
        return this.store.destroy(this);
    }
}