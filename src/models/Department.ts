import { action, computed, makeObservable, observable } from "mobx";
import { Department as DepartmentProps } from "../api/department";
import { DepartmentStore } from "../stores/DepartmentStore";
import Event from '../models/Event';
import ApiModel from "./ApiModel";
import _ from "lodash";
import { getChanges } from "./helpers";

export default class Department implements ApiModel<DepartmentProps> {
    readonly _pristine: DepartmentProps;
    private readonly store: DepartmentStore;
    readonly id: string;
    readonly name: string;
    readonly createdAt: Date;
    @observable.ref
    updatedAt: Date;

    @observable
    description: string;

    constructor(props: DepartmentProps, store: DepartmentStore) {
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @computed
    get events(): Event[] {
        return this.store.getEvents(this);
    }

    @computed
    get props(): DepartmentProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }

    @computed
    get dirtyProps(): Partial<DepartmentProps> {
        return getChanges(this);
    }

    @computed
    get isDirty(): boolean {
        return Object.keys(this.dirtyProps).length > 0;
    }

    @action
    update(props: Partial<DepartmentProps>) {
        if ('description' in props) {
            this.description = props.description;
        }
        if ('updatedAt' in props) {
            this.updatedAt = new Date(props.updatedAt);
        }
    }

    @action
    reset() {
        this.update(this._pristine);
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