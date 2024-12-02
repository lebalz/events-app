import { action, computed, makeObservable, observable, override } from 'mobx';
import { Semester as SemesterProps } from '../api/semester';
import { ApiAction } from '../stores/iStore';
import { SemesterStore } from '../stores/SemesterStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import { formatDate, formatTime, toGlobalDate, toLocalDate } from './helpers/time';
import Lesson from './Untis/Lesson';

export default class Semester extends ApiModel<SemesterProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<SemesterProps>[] = [
        { attr: 'start', transform: (val) => toLocalDate(new Date(val)) },
        { attr: 'end', transform: (val) => toLocalDate(new Date(val)) },
        { attr: 'untisSyncDate', transform: (val) => toLocalDate(new Date(val)) },
        'name'
    ];
    readonly isUserModel = false;
    readonly _pristine: SemesterProps;
    readonly store: SemesterStore;
    readonly id: string;
    @observable accessor name: string;

    @observable.ref accessor start: Date;

    @observable.ref accessor end: Date;

    @observable.ref accessor untisSyncDate: Date;

    @observable accessor description: string;

    readonly createdAt: Date;

    @observable.ref accessor updatedAt: Date;

    constructor(props: SemesterProps, store: SemesterStore) {
        super();
        this._pristine = props;
        this.store = store;
        this.id = props.id;
        this.name = props.name;
        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));
        this.untisSyncDate = toLocalDate(new Date(props.untisSyncDate));
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    @override
    get props(): SemesterProps {
        return {
            id: this.id,
            name: this.name,
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString(),
            untisSyncDate: toGlobalDate(this.untisSyncDate).toISOString(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
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
    get fUntisSyncDate() {
        return formatDate(this.untisSyncDate);
    }

    @computed
    get isSyncdateWithinSemester() {
        return this.untisSyncDate >= this.start && this.untisSyncDate <= this.end;
    }

    @computed
    get events() {
        return this.store.eventsBySemester(this);
    }

    @computed
    get untisSyncJobs() {
        return this.store.jobsBySemester(this);
    }

    @computed
    get isCurrent() {
        const now = Date.now();
        return this.start.getTime() < now && this.end.getTime() > now;
    }

    @computed
    get isPast() {
        return this.end.getTime() < Date.now();
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
    get lessons(): Lesson[] {
        return this.store.lessonsBySemester(this);
    }

    @computed
    get semesterName(): `${number}HS` | `${number}FS` {
        const suffix = ['HS', 'FS'][this.semester - 1] as 'HS' | 'FS';
        return `${this.year}${suffix}`;
    }
}
