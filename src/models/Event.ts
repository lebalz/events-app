import { action, computed, makeObservable, observable, override } from 'mobx';
import { Event as EventProps, EventState } from '../api/event';
import { EventStore } from '../stores/EventStore';
import ApiModel, { UpdateableProps } from './ApiModel';

const formatTime = (date: Date) => {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
}

const formatDate = (date: Date) => {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = `${date.getFullYear()}`.padStart(4, '0');

    return `${day}.${month}.${year}`;
}

const toLocalDate = (date: Date) => {   
    return new Date(date.getTime() + date.getTimezoneOffset() * MINUTE_2_MS)
}

const toGlobalTime = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * MINUTE_2_MS)
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

export default class Event extends ApiModel<EventProps> {
    readonly store: EventStore;
    readonly _pristine: EventProps;
    readonly UPDATEABLE_PROPS: UpdateableProps<EventProps>[] = ['description', 'descriptionLong', 'start', 'end', 'location', 'state', 'departmentIds'];
    readonly id: string;
    readonly authorId: string;
    readonly createdAt: Date;
    readonly jobId: string;
    @observable.ref
    updatedAt: Date;
    readonly state: EventState;

    departmentIds = observable<string>([]);
    classes = observable<string>([]);

    @observable
    description: string;

    @observable
    descriptionLong: string;

    @observable
    location: string;

    @observable
    end: Date;

    @observable
    start: Date;

    @observable
    allDay: boolean;

    constructor(props: EventProps, store: EventStore) {
        super();
        if (props.id === '848d752e-218b-4736-a04b-590a204d94b3') {
            console.log('here', props);
        }
        this._pristine = props;
        this.store = store;
        this.id = props.id;
        this.jobId = props.jobId;
        this.state = props.state;
        this.authorId = props.authorId;
        this.departmentIds.replace(props.departmentIds);
        this.classes.replace(props.classes);
        this.description = props.description;
        this.descriptionLong = props.descriptionLong;
        this.location = props.location;
        
        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));

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

    compare(other: Event) {
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
        this.setStart(start);
        this.setEnd(end);
    }

    @computed
    get deparments() {
        return this.store.getDepartments(this.departmentIds);
    }

    @computed
    get departmentNames() {
        return this.deparments.map(d => d.name);
    }

    @action
    setStart(date: Date) {
        this.start = new Date(date);
    }

    @action
    setEnd(date: Date) {
        this.end = new Date(date);
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
    get weekOffsetMS_start() {
        return getWeekdayOffsetMS(this.start);
    }

    @computed
    get weekOffsetMS_end() {
        return this.weekOffsetMS_start + this.durationMS;
    }

    @computed
    get kw() {
        return getKW(this.start);
    }

    @computed
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
        return (prog / this.durationMS) * 100;
    }

    @override
    get props(): EventProps {
        return {
            id: this.id,
            jobId: this.jobId,
            state: this.state,
            authorId: this.authorId,
            departmentIds: this.departmentIds.slice(),
            classes: this.classes.slice(),
            description: this.description,
            descriptionLong: this.descriptionLong,
            location: this.location,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            start: toGlobalTime(this.start).toISOString(),
            end: toGlobalTime(this.end).toISOString(),
            allDay: this.allDay
        }
    }
}
