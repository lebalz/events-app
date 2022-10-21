import { action, computed, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { Event as EventProps, EventState } from '../api/event';

moment.locale('de-CH');

export const getTime = (date: Date) => {
    return date.toISOString().slice(11, 16)
}
const getDate = (date: Date) => {
    return date.toISOString().slice(0, 10).split('-').reverse().join('.')
}

export default class SchoolEvent {
    readonly id: string;
    readonly authorId: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly state: EventState;

    categories = observable<string>([]);
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
        this.categories.replace(props.categories);
        this.classes.replace(props.classes);
        this.responsibleIds.replace(props.responsibleIds);
        this.description = props.description;
        this.descriptionLong = props.descriptionLong;
        this._start = props.start;
        this._end = props.end;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
        this.allDay = props.allDay;

        makeObservable(this);
    }

    get start() {
        return moment.utc(this._start);
    }

    get end() {
        return moment.utc(this._end);
    }

    @action
    setStart(date: moment.Moment) {
        this._start = date.utc().format();
    }

    @action
    setEnd(date: moment.Moment) {
        this._end = date.utc().format();
    }

    get startTime() {
        return this.start.format('HH:mm');
    }

    get endTime() {
        return this.end.format('HH:mm');
    }

    get startDate() {
        return this.start.format('DD.MM.YYYY');
    }

    get endDate() {
        return this.end.format('DD.MM.YYYY');
    }

    /**
     * returns the weeks monday as utc moment
     */
    get weeksMonday() {
        return this.start.startOf('isoWeek');
    }

    get weekOffsetMS_start() {
        return this.start.diff(this.weeksMonday, 'milliseconds')
    }

    get weekOffsetMS_end() {
        return this.weekOffsetMS_start + this.durationMS;
    }

    get kw() {
        return this.start.isoWeek();
    }

    get weekday() {
        return this.start.format('dddd');
    }

    @computed
    get durationMS() {
        return this.end.diff(this.start, 'milliseconds');
    }

    @computed
    get progress() {
        const prog = moment.utc().diff(this.start, 'milliseconds');
        if (prog > this.durationMS) {
            return 100;
        }
        if (prog < 0) {
            return 0;
        }
        if (this.durationMS === 0) {
            return 100;
        }
        return Math.round((prog / this.durationMS) * 100);
    }
}
