import { action, computed, makeObservable, observable } from 'mobx';
import moment, { Moment } from 'moment';
import { Event as EventProps, EventState } from '../api/event';

const formatTime = (date: Date) => {
    return `${date.getUTCHours()}:${date.getMinutes()}`;
}

const formatDate = (date: Date) => {
    return `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;
}

const SEC_2_MS = 1000;
const MINUTE_2_MS = 60 * SEC_2_MS;
const HOUR_2_MS = 60 * MINUTE_2_MS;
const DAY_2_MS = 24 * HOUR_2_MS;
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
    readonly id: string;
    readonly authorId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly state: EventState;

    departements = observable<string>([]);
    classes = observable<string>([]);
    responsibleIds = observable<string>([]);

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

    constructor(props: EventProps) {
        this.id = props.id;
        this.state = props.state;
        this.authorId = props.authorId;
        this.departements.replace(props.departements);
        this.classes.replace(props.classes);
        this.responsibleIds.replace(props.responsibleIds);
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
}
