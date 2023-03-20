import { action, computed, makeObservable, observable, override } from "mobx";
import { Semester as SemesterProps } from "../api/semester";
import { SemesterStore } from "../stores/SemesterStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import { formatDate, formatTime } from "./helpers/time";

export default class Semester extends ApiModel<SemesterProps> {
    readonly UPDATEABLE_PROPS: UpdateableProps<SemesterProps>[] = [
        { start: (val) => new Date(val) }, 
        { end: (val) => new Date(val) }, 
        'name'
    ];
    readonly _pristine: SemesterProps;
    readonly store: SemesterStore;
    readonly id: string;
    @observable
    name: string;

    @observable.ref
    start: Date;
    @observable.ref
    end: Date;
    @observable
    description: string;
    readonly createdAt: Date;
    @observable.ref
    updatedAt: Date;

    constructor(props: SemesterProps, store: SemesterStore) {
        super();
        this._pristine = props;
        this.store = store;
        this.id = props.id;
        this.name = props.name;
        this.start = new Date(props.start);
        this.end = new Date(props.end);
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @override
    get props(): SemesterProps {
        return {
            id: this.id,
            name: this.name,
            start: this.start.toISOString(),
            end: this.end.toISOString(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }

    @computed
    get fStartTime() {
        return formatTime(this.start);
    }

    @computed
    get fEndTime() {
        return formatTime(this.end);
    }

    @computed
    get fStartDate() {
        return formatDate(this.start);
    }

    @computed
    get fEndDate() {
        return formatDate(this.end);
    }

    @computed
    get events() {
        return this.store.eventsBySemester(this);
    }

    @computed
    get isCurrent() {
        return this.start.getTime() < Date.now() && this.end.getTime() > Date.now();
    }
}