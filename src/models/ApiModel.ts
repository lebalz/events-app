import { action, computed, IObservableArray, makeObservable, observable, reaction } from "mobx";
import _ from 'lodash';
import iStore from "../stores/iStore";
import { notEqual } from "./helpers";

export type UpdateableProps<T extends { id: string }> = (keyof T | { attr: keyof T, transform?: (value: any) => any});

export default abstract class ApiModel<T extends { id: string }, Api = ''> {
    abstract readonly _pristine: T;
    abstract readonly store: iStore<T, any>;
    abstract readonly id: string;
    abstract readonly UPDATEABLE_PROPS: UpdateableProps<T>[];

    @observable
    _isEditing = false;

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
    reset(finishEditing = true) {
        if (finishEditing) {
            this.setEditing(false);
        }
        return this.update(this.pristine);
    }

    @action
    update(props: Partial<T>) {
        this.UPDATEABLE_PROPS.forEach(val => {
            const key = typeof val === 'object' ? val.attr : val;
            if (key in props) {
                const value = typeof val === 'object' ? val.transform(props[key]) : props[key];
                if (Array.isArray(value)) {
                    ((this as any)[key] as IObservableArray<T>).replace(value as T[]);
                } else {
                    Object.assign(this, { [key]: value });
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

    @action
    setEditing(editing: boolean) {
        this._isEditing = editing;
    }

    @computed
    get isEditing() {
        return this._isEditing || this.isDirty;
    }

    apiStateFor(sigId: Api) {
        return this.store.apiStateFor(sigId);
    }

    @action
    cleanup() {
        /** when needed, clean up */
    }
}