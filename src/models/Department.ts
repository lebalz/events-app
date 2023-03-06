import { computed, makeObservable, observable } from "mobx";
import { Department as DepartmentProps } from "../api/department";
import { DepartmentStore } from "../stores/DepartmentStore";
import Event from '../models/Event';

export default class Department {
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
}