import { computed, makeObservable, observable } from "mobx";
import { Semester as SemesterProps } from "../api/semester";
import { SemesterStore } from "../stores/SemesterStore";

export default class Semester {
    private readonly store: SemesterStore;
    readonly id: string;
    readonly name: string;
    @observable
    description: string;
    readonly createdAt: Date;
    @observable.ref
    updatedAt: Date;

    constructor(props: SemesterProps, store: SemesterStore) {
        this.store = store;
        this.id = props.id;
        this.name = props.name;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }
}