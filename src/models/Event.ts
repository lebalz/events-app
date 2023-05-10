import { action, computed, makeObservable, observable, override, reaction } from 'mobx';
import { Event as EventProps, EventState, JoiEvent } from '../api/event';
import { EventStore } from '../stores/EventStore';
import { ApiAction } from '../stores/iStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import { toLocalDate, formatTime, formatDate, getKW, DAYS, toGlobalDate, DAY_2_MS, HOUR_2_MS, MINUTE_2_MS, WEEK_2_MS, getLastMonday } from './helpers/time';
import Klass from './Untis/Klass';
import Lesson from './Untis/Lesson';
import User from './User';
import Joi from 'joi';
import _ from 'lodash';

export interface iEvent {
    weekOffsetMS_start: number;
    weekOffsetMS_end: number;
    year: number;
}
export default class Event extends ApiModel<EventProps, ApiAction> implements iEvent {
    readonly store: EventStore;
    readonly _pristine: EventProps;
    readonly UPDATEABLE_PROPS: UpdateableProps<EventProps>[] = [
        'description', 
        'descriptionLong', 
        {attr: 'start', transform: (val) => toLocalDate(new Date(val))}, 
        {attr: 'end', transform: (val) => toLocalDate(new Date(val))}, 
        'location',
        'teachersOnly',
        'classGroups',
        'classes',
        'departmentIds',
        'klpOnly',
        'teachersOnly'
    ];
    readonly id: string;
    readonly authorId: string;
    readonly createdAt: Date;
    readonly jobId: string;
    readonly state: EventState;
    readonly _pristine_end: Date;
    readonly _pristine_start: Date;

    @observable.ref
    updatedAt: Date;

    /**
     * These are **only** the departments, which are added as a whole.
     * Notice: this is not the same as the departments, which are all deparments affected by this event,
     *         which is the **union** of this and the departments of the classes
     */
    departmentIds = observable.set<string>([]);
    classes = observable.set<string>([]);
    classGroups = observable.set<string>([]);

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
    allLPs: boolean;

    @observable
    allDay: boolean;
    @observable
    klpOnly: boolean;
    @observable
    teachersOnly: boolean;

    @observable
    selected: boolean = false;

    @observable.ref
    _errors?: Joi.ValidationError

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
        this.classGroups.replace(props.classGroups);
        this.description = props.description;
        this.descriptionLong = props.descriptionLong;
        this.location = props.location;
        this.klpOnly = props.klpOnly;
        this.teachersOnly = props.teachersOnly;
        this.allLPs = this.departmentIds.size > 0 && props.classes.length === 0;
        
        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));

        this._pristine_start = toLocalDate(new Date(props.start));
        this._pristine_end = toLocalDate(new Date(props.end));

        
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
        makeObservable(this);
        if (this.state !== EventState.Published && this.state !== EventState.Deleted) {
            this.validate();
        }
        reaction(
            () => this.props, 
            () => {
                this.validate();
            }
        );
    }

    @action
    validate() {
        const result = JoiEvent.validate(this.props, {abortEarly: false});
        if (result.error) {
            this._errors = result.error;
        } else {
            this._errors = undefined;
        }
    }

    @computed
    get isValid() {
        return this._errors === undefined || this._errors.details.length === 0;
    }

    errorFor(attr: keyof EventProps) {
        if (this._errors) {
            const error = this._errors.details.find((e) => e.context?.key === attr);
            return error;
        }
        return undefined;
    }

    @action
    setAllLPs(allLPs: boolean) {
        this.allLPs = allLPs;
    }

    @computed
    get author() {
        return this.store.root.userStore.find<User>(this.authorId);
    }

    @action
    requestState(state: EventState) {
        this.store.requestState([this.id], state);
    }

    @action
    toggleClass(klass: string) {
        if (this.classes.has(klass)) {
            this.classes.delete(klass);
        } else {
            this.classes.add(klass);
        }
    }

    @action
    toggleClassGroup(klass: string) {
        if (this.classGroups.has(klass)) {
            this.classGroups.delete(klass);
        } else {
            this.classGroups.add(klass);
        }
    }

    @action
    toggleDepartment(departmentId: string) {
        if (this.departmentIds.has(departmentId)) {
            this.departmentIds.delete(departmentId);
        } else {
            this.departmentIds.add(departmentId);
        }
    }

    /**
     * @returns all departments of the event, inlcuding the departments of the classes
     */
    @computed
    get departments() {
        const depIds = new Set([...this.departmentIds, ...this.untisClasses.map(c => c.departmentId)]);
        return this.store.getDepartments([...depIds]);
    }

    /**
     * Returns all department ids of the event and its classes
     */
    @computed
    get departmentIdsAll() {
        return new Set(this.departments.map(d => d.id));
    }

    @computed
    get departmentNames() {
        return this.departments.map(d => d.name);
    }

    @action
    setKlpOnly(klpOnly: boolean) {
        this.klpOnly = klpOnly;
    }

    @action
    setTeachersOnly(teachersOnly: boolean) {
        this.teachersOnly = teachersOnly;
    }

    @action
    setExpanded(expanded: boolean) {
        this.store.root.viewStore.setEventExpanded(this.id, expanded);
    }

    @computed
    get isExpanded() {
        return this.store.root.viewStore.expandedEventIds.has(this.id);
    }

    @action
    setSelected(selected: boolean) {
        this.selected = selected;
    }

    @computed
    get isEditable() {
        if (this.state !== EventState.Draft) {
            return false;
        }
        return this.store.canEdit(this);
    }

    /**
     * Returns the milliseconds since epoche from the pristine start time
     */
    @computed
    get startTimeMs() {
        return toLocalDate(this._pristine_start).getTime();
    }

    /**
     * Returns the milliseconds since epoche from the pristine end time
     */
    @computed
    get endTimeMs() {
        return toLocalDate(this._pristine_end).getTime();
    }

    compare(other: Event) {
        if (this.startTimeMs === other.startTimeMs) {
            if (this.endTimeMs === other.endTimeMs) {
                return this.updatedAt.getTime() - other.updatedAt.getTime();
            }
            return this.endTimeMs - other.endTimeMs;
        }
        return this.startTimeMs - other.startTimeMs;
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
    get startHHMM() {
        return this.start.getHours() * 100 + this.start.getMinutes();
    }
    @computed
    get endHHMM() {
        return this.end.getHours() * 100 + this.end.getMinutes();
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
    get fClasses(): string[] {
        const kls: {[year: string]: string[]} = {};
        [...this.classes].sort().forEach(c => {
            const year = c.slice(0, 2);
            if (!kls[year]) {
                kls[year] = [];
            }
            kls[year].push(c.slice(2));
        });
        return Object.keys(kls).map(year => `${year}${kls[year].sort().join('')}`);
    }

    @computed
    get weekOffsetMS_start() {
        const hours = Math.floor(this.startHHMM / 100);
        const minute = this.startHHMM % 100;
        return this.start.getDay() * DAY_2_MS + hours * HOUR_2_MS + minute * MINUTE_2_MS;
    }

    @computed
    get weekOffsetMS_end() {
        return this.weekOffsetMS_start + this.durationMS;
    }

    @computed
    get kw() {
        return getKW(this.start);
    }

    /**
     * Date of the first day of the current week
     */
    @computed
    get weekStart() {
        return getLastMonday(this.start);
    }

    /**
     * Date of the last day of the current week
     */
    @computed
    get weekEnd() {
        return new Date(this.weekStart.getTime() + 6 * DAY_2_MS);
    }

    @computed
    get day(): typeof DAYS[number] {
        return DAYS[this.start.getDay()];
    }

    /**
     * Returns the calendar year of the event
     * @example 2023
     */
    @computed
    get year() {
        return this.start.getFullYear();
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

    affectsUser(user: User) {
        if (user.departments.some(d => this.departmentIds.has(d.id))) {
            return true;
        }
        if (this.klpOnly && user.untisTeacher && this.untisClasses.some(c => c.klp.id === user.untisTeacher.id)) {
            return true;
        }
        if (this.teachersOnly && user.classes.some(c => this.affectsClass(c))) {
            return true;
        }
        if (user.untisTeacher && this.affectedLessons.some(l => l.teacherIds.includes(user.untisTeacher.id))) {
            return true;
        }
        return false;
    }

    affectsClass(klass: Klass): boolean {
        return this.untisClasses.some(c => c.id === klass.id);
    }

    hasOverlap(lesson: Lesson) {
        const {weeks, minutes} = this.duration;
        const dayOffset = (lesson.weekDay + weeks * 7 - this.weekDay) % 7;
        const startOffset = dayOffset * 24 * 60 + Math.floor(lesson.startHHMM / 100) * 60 + lesson.startHHMM % 100;
        const endOffset = dayOffset * 24 * 60 + Math.floor(lesson.endHHMM / 100) * 60 + lesson.endHHMM % 100;
        const eventStartOffset = this.start.getHours() * 60 + this.start.getMinutes();

        return startOffset < (eventStartOffset + minutes) && endOffset > eventStartOffset;
    }

    @computed
    get untisClasses() {
        return this.store.getUntisClasses(this);
    }

    @computed
    get affectedLessons(): Lesson[] {
        const lessons = this.untisClasses.map(c => c.lessons.slice().filter(l => this.hasOverlap(l))).flat();
        return _.uniqBy(lessons, 'id').sort((a, b) => a.weekOffsetMS_start - b.weekOffsetMS_start);
    }

    @computed
    get affectedLessonsByClass(): {class: string, lessons: Lesson[]}[] {
        return this.untisClasses.map(c => ({
            class: c.name,
            lessons: c.lessons.slice().filter(l => this.hasOverlap(l)).sort((a, b) => a.weekOffsetMS_start - b.weekOffsetMS_start)
        }));
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
            departmentIds: [...this.departmentIds],
            classes: [...this.classes],
            description: this.description,
            descriptionLong: this.descriptionLong,
            location: this.location,
            classGroups: [...this.classGroups],
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            klpOnly: this.klpOnly,
            teachersOnly: this.teachersOnly,
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString()
        }
    }

    @computed
    get duration() {
        const period = this.durationMS;
        return {
            weeks: Math.ceil(period / WEEK_2_MS),
            days: Math.ceil(period / DAY_2_MS),
            hours: Math.ceil(period / HOUR_2_MS),
            minutes: Math.ceil(period / MINUTE_2_MS)
        }
    }

    /**
     * @returns The day of the week of the event
     * @example 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
     */
    @computed
    get weekDay(): number {
        return this.start.getDay();
    }
}
