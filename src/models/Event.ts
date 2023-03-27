import { action, computed, makeObservable, observable, override } from 'mobx';
import { Event as EventProps, EventState } from '../api/event';
import { EventStore } from '../stores/EventStore';
import { ApiAction } from '../stores/iStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import { toLocalDate, formatTime, formatDate, getWeekdayOffsetMS, getKW, DAYS, toGlobalDate } from './helpers/time';
import Klass from './Untis/Klass';

export default class Event extends ApiModel<EventProps, ApiAction> {
    readonly store: EventStore;
    readonly _pristine: EventProps;
    readonly UPDATEABLE_PROPS: UpdateableProps<EventProps>[] = [
        'description', 
        'descriptionLong', 
        {start: (val) => toLocalDate(new Date(val))}, 
        {end: (val) => toLocalDate(new Date(val))}, 
        'location', 
        'state',
        'classes',
        'departmentIds'
    ];
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

    @computed
    get deparments() {
        return this.store.getDepartments(this.departmentIds);
    }

    @computed
    get departmentNames() {
        return this.deparments.map(d => d.name);
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

    affectsClass(klass: Klass) {
        return this.classes.some(c => c === klass.name);
    }

    @computed
    get isPublic() {
        return this.state === EventState.Published;
    }

    @computed
    get queryParam() {
        return `id=${this.id}`;
    }

    @computed
    get shareUrl() {
        return `/event?${this.queryParam}`;
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
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString(),
            allDay: this.allDay
        }
    }
}
