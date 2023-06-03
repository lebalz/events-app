import { action, computed, makeObservable, observable, override } from "mobx";
import { Semester as SemesterProps } from "../api/semester";
import { ApiAction } from "../stores/iStore";
import { SemesterStore } from "../stores/SemesterStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import { formatDate, formatTime, toGlobalDate, toLocalDate } from "./helpers/time";

export default class Semester extends ApiModel<SemesterProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<SemesterProps>[] = [
        { attr: 'start', transform: (val) => toLocalDate(new Date(val)) }, 
        { attr: 'end', transform: (val) => toLocalDate(new Date(val)) }, 
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
        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @override
    get props(): SemesterProps {
        return {
            id: this.id,
            name: this.name,
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString(),
            untisSyncDate: this._pristine.untisSyncDate,
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

    @computed
    get year() {
        return this.start.getFullYear();
    }

    @computed
    get semester(): 1 | 2 {
        const month = this.start.getMonth() + 1;
        if (month < 8) {
            return 2;
        }
        return 1;
    }

    @computed
    get semesterName(): `${number}HS` | `${number}FS` {
        const suffix = ["HS", "FS"][this.semester - 1] as 'HS' | 'FS';
        return `${this.year}${suffix}`;
    }
}