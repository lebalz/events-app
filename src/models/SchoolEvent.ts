import { action, computed, makeObservable, observable } from 'mobx';
import moment, { Moment } from 'moment';
import { Departments, Event as EventProps, EventState } from '../api/event';
import { EventStore } from '../stores/EventStore';

const formatTime = (date: Date) => {
    const hours = `${date.getUTCHours()}`.padStart(2, '0');
    const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
}

const formatDate = (date: Date) => {    
    const day = `${date.getUTCDate()}`.padStart(2, '0');
    const month = `${date.getUTCMonth() + 1}`.padStart(2, '0');
    const year = `${date.getUTCFullYear()}`.padStart(4, '0');

    return `${day}.${month}.${year}`;
}

export const SEC_2_MS = 1000;
export const MINUTE_2_MS = 60 * SEC_2_MS;
export const HOUR_2_MS = 60 * MINUTE_2_MS;
export const DAY_2_MS = 24 * HOUR_2_MS;
const DAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

const getWeekdayOffsetMS = (date: Date) => {
    const days = date.getUTCDay() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return days * DAY_2_MS + hours * HOUR_2_MS + minutes * MINUTE_2_MS + seconds * SEC_2_MS;
}

const getKW = (date: Date) => {
    const year = new Date(date.getTime());
    year.setUTCHours(0, 0, 0, 0);
    year.setUTCMonth(0, 0)
    return Math.ceil((date.getTime() - year.getTime()) / DAY_2_MS / 7);
}

export default class SchoolEvent {
    private readonly store: EventStore;
    readonly id: string;
    readonly authorId: string;
    readonly createdAt: Date;
    readonly jobId: string;
    @observable.ref
    updatedAt: Date;
    readonly state: EventState;

    departments = observable<Departments>([]);
    classes = observable<string>([]);

    @observable
    description: string;

    @observable
    descriptionLong: string;

    @observable
    location: string;

    @observable
    _end: string;

    @observable
    _start: string;

    @observable
    allDay: boolean;

    @observable
    isOutdated: boolean = false;

    constructor(props: EventProps, store: EventStore) {
        this.store = store;
        this.id = props.id;
        this.jobId = props.jobId;
        this.state = props.state;
        this.authorId = props.authorId;
        this.departments.replace(props.departments);
        this.classes.replace(props.classes);
        this.description = props.description;
        this.descriptionLong = props.descriptionLong;
        this.location = props.location;
        this._start = props.start;
        this._end = props.end;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
        this.allDay = props.allDay;
        makeObservable(this);
    }

    @computed
    get invalid(): boolean {
        return this.durationMS <= 0
    }


    @computed
    get isEditable() {
        return this.store.canEdit(this);
    }

    get start() {
        return new Date(this._start);
    }

    get end() {
        return new Date(this._end);
    }

    get localStart() {
        const s = this.start
        return new Date(s.getTime() + s.getTimezoneOffset() * MINUTE_2_MS)
    }

    get localEnd() {
        const e = this.end
        return new Date(e.getTime() + e.getTimezoneOffset() * MINUTE_2_MS)
    }

    compare(other: SchoolEvent) {
        if (this.start.getTime() === other.start.getTime()) {
            if (this.end.getTime() === other.end.getTime()) {
                return this.updatedAt.getTime() - other.updatedAt.getTime();
            }
            return this.end.getTime() - other.end.getTime();
        }
        return this.start.getTime() - other.start.getTime();
    }

    
    @action
    setDateRange(start: Date, end: Date) {
        const startD = new Date(start.getTime() - start.getTimezoneOffset() * MINUTE_2_MS);
        const endD = new Date(end.getTime() - end.getTimezoneOffset() * MINUTE_2_MS);
        this._start = startD.toISOString();
        this._end = endD.toISOString();
    }

    @action
    setStartDate(date: Date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.start.getHours(), this.start.getMinutes(), this.start.getSeconds());
        this._start = d.toISOString();
    }

    @action
    setEndDate(date: Date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.start.getHours(), this.start.getMinutes(), this.start.getSeconds());
        this._end = d.toISOString();
    }

    @action
    setStart(date: Date) {
        this._start = date.toISOString();
    }

    @action
    setEnd(date: Date) {
        this._end = date.toISOString();
    }

    get startTime() {
        return formatTime(this.start);
    }

    get endTime() {
        return formatTime(this.end);
    }

    get startDate() {
        return formatDate(this.start);
    }

    get endDate() {
        return formatDate(this.end);
    }

    get weekOffsetMS_start() {
        return getWeekdayOffsetMS(this.start);
    }

    get weekOffsetMS_end() {
        return this.weekOffsetMS_start + this.durationMS;
    }

    get kw() {
        return getKW(this.start);
    }

    get weekday() {
        return DAYS[this.start.getUTCDay()];
    }

    @action
    setDescription(description: string) {
        this.description = description;
    }

    @computed
    get durationMS() {
        return this.end.getTime() - this.start.getTime();
    }

    @computed
    get progress() {
        const prog = Date.now() - this.start.getTime();
        if (prog > this.durationMS) {
            return 100;
        }
        if (prog < 0) {
            return 0;
        }
        if (this.durationMS === 0) {
            return 100;
        }
        return (prog / this.durationMS) * 100 ;
    }

    @computed
    get props(): EventProps {
        return {
            id: this.id,
            jobId: this.jobId,
            state: this.state,
            authorId: this.authorId,
            departments: this.departments.slice(),
            classes: this.classes.slice(),
            description: this.description,
            descriptionLong: this.descriptionLong,
            location: this.location,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            start: (new Date(this._start)).toISOString(),
            end: (new Date(this._end)).toISOString(),
            allDay: this.allDay
        }
    }

    @action
    save() {
        this.store.save(this.id);
    }

    @action
    update(props: Partial<EventProps>) {
        if (props.departments) {
            this.departments.replace(props.departments);
        }
        if (props.classes) {
            this.classes.replace(props.classes);
        }
        if (props.description) {
            this.description = props.description;
        }
        if (props.descriptionLong) {
            this.descriptionLong = props.descriptionLong;
        }
        if (props.location) {
            this.location = props.location;
        }
        if (props.start) {
            this._start = props.start;
        }
        if (props.end) {
            this._end = props.end;
        }
        if (props.allDay) {
            this.allDay = props.allDay;
        }
        this.store.save(this.id);
    }
}
