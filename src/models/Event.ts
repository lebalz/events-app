import { IReactionDisposer, action, computed, makeObservable, observable, override, reaction } from 'mobx';
import {
    EventAudience,
    Event as EventProps,
    EventState,
    JoiEvent,
    JoiMessages,
    Meta,
    TeachingAffected
} from '../api/event';
import { EventStore } from '../stores/EventStore';
import { ApiAction } from '../stores/iStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import {
    toLocalDate,
    formatTime,
    formatDate,
    getKW,
    DAYS,
    toGlobalDate,
    DAY_2_MS,
    HOUR_2_MS,
    MINUTE_2_MS,
    WEEK_2_MS,
    getLastMonday,
    DAYS_LONG,
    dateBetween,
    formatDateLong,
    currentGradeYear
} from './helpers/time';
import Klass from './Untis/Klass';
import Lesson from './Untis/Lesson';
import User from './User';
import Joi from 'joi';
import _ from 'lodash';
import { KlassName } from './helpers/klassNames';
import humanize from 'humanize-duration';
import Department from './Department';
import { LessonOverlap, lessonOverlap } from './helpers/lessonOverlap';

export interface iEvent {
    weekOffsetMS_start: number;
    weekOffsetMS_end: number;
    year: number;
}

interface DepartmentState {
    someDepartments: boolean;
    allDepartments: boolean;
    someDepartmentsDe: boolean;
    allDepartmentsDe: boolean;
    someDepartmentsFr: boolean;
    allDepartmentsFr: boolean;
}

export enum ValidState {
    Valid = 'VALID',
    Error = 'ERROR',
    Warning = 'WARNING',
    Info = 'INFO'
}

export enum InvalidTransition {
    Validation = 'validation',
    InitialValidation = 'initialValidation',
    NoOpenRegistrationPeriod = 'noOpenRegistrationPeriod',
    NotAllowed = 'notAllowed'
}

interface InvalidTransitionState {
    allowed: false;
    reason: InvalidTransition;
}
interface ValidTransitionState {
    allowed: true;
    reason?: undefined;
}

type TransitionState = InvalidTransitionState | ValidTransitionState;

const currentKW = getKW(new Date());
const currentYear = new Date().getFullYear();
export const CURRENT_YYYY_KW = `${currentYear}-${currentKW}`;

export default class Event extends ApiModel<EventProps, ApiAction> implements iEvent {
    readonly store: EventStore;
    readonly _pristine: EventProps;
    readonly isUserModel: boolean;
    readonly UPDATEABLE_PROPS: UpdateableProps<EventProps>[] = [
        'description',
        'descriptionLong',
        {
            attr: 'start',
            update: action((val: string) => {
                const date = toLocalDate(new Date(val));
                // if (date.getTime() > this.end.getTime()) {
                //     const diff = this.end.getTime() - this.start.getTime();
                //     this.end = new Date(date.getTime() + diff);
                // }
                this.start = date;
            })
        },
        {
            attr: 'end',
            update: action((val: string) => {
                const date = toLocalDate(new Date(val));
                // if (date.getTime() < this.start.getTime()) {
                //     const diff = this.end.getTime() - this.start.getTime();
                //     this.start = new Date(date.getTime() - diff);
                // }
                this.end = date;
            })
        },
        'location',
        'audience',
        'classGroups',
        'classes',
        'departmentIds',
        'teachingAffected',
        'affectsDepartment2'
    ];
    readonly id: string;
    readonly authorId: string;
    readonly createdAt: Date;
    readonly jobId: string;
    readonly state: EventState;
    readonly _pristine_end: Date;
    readonly _pristine_start: Date;
    readonly parentId: string | null;
    readonly cloned: boolean;
    /** this contains only! the published child versions! */
    readonly publishedVersionIds: string[];
    readonly meta: Meta;
    readonly clonedFromId: string | null;
    readonly _initializedAt: number;

    @observable.ref accessor updatedAt: Date;

    /**
     * These are **only** the departments, which are added as a whole.
     * Notice: this is not the same as the departments, which are all deparments affected by this event,
     *         which is the **union** of this and the departments of the classes
     */
    departmentIds = observable.set<string>([]);
    classes = observable.set<KlassName>([]);
    classGroups = observable.set<string>([]);

    @observable accessor description: string;

    @observable accessor descriptionLong: string;

    @observable accessor location: string;

    @observable.ref accessor end: Date;

    @observable.ref accessor deletedAt: Date | undefined;

    @observable.ref accessor start: Date;

    @observable accessor allLPs: boolean;

    @observable accessor audience: EventAudience;

    @observable accessor showAsAllDay: boolean;

    @observable accessor teachingAffected: TeachingAffected;

    @observable accessor versionsLoaded: boolean = false;

    @observable.ref accessor _errors: Joi.ValidationError | undefined;

    @observable accessor affectsDepartment2: boolean;
    @observable accessor initialValidation: boolean = false;

    validationDisposer: IReactionDisposer;
    validationTimeout: NodeJS.Timeout;
    _initialValidationTriggered: boolean = false;

    constructor(props: EventProps, store: EventStore) {
        super();
        this._initializedAt = Date.now();
        this._pristine = props;
        this.isUserModel = props.state !== EventState.Published || !props.parentId;
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
        this.audience = props.audience;
        this.teachingAffected = props.teachingAffected;
        this.cloned = props.cloned;
        this.publishedVersionIds = props.publishedVersionIds;
        this.affectsDepartment2 = props.affectsDepartment2;
        this.clonedFromId = props.clonedFromId;

        this.parentId = props.parentId;

        this.start = toLocalDate(new Date(props.start));
        this.end = toLocalDate(new Date(props.end));
        this.deletedAt = props.deletedAt ? toLocalDate(new Date(props.deletedAt)) : null;

        this._pristine_start = toLocalDate(new Date(props.start));
        this._pristine_end = toLocalDate(new Date(props.end));

        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
        this.showAsAllDay = this.isAllDay;
        this.meta = props.meta;

        this.validationDisposer = reaction(
            () => this.props,
            () => {
                if (this.initialValidation) {
                    this.validate();
                }
            }
        );
    }

    @computed
    get componentKey() {
        return `${this.id}@${this._initializedAt}`;
    }

    @action
    triggerInitialValidation() {
        if (this.initialValidation || this._initialValidationTriggered) {
            return;
        }
        this._initialValidationTriggered = true;
        if (!this.isDirty && (this.isPublished || this.isDeleted)) {
            return;
        }
        this.validationTimeout = setTimeout(
            () => {
                this.validate();
            },
            100 + Math.round(Math.random() * 300)
        );
    }

    @computed
    get importWarnings() {
        if (!this.meta || this.meta.warningsReviewed) {
            return [];
        }
        return this.meta.warnings || [];
    }

    @computed
    get clonedFrom() {
        if (!this.clonedFromId) {
            return;
        }
        return this.store.find<Event>(this.clonedFromId);
    }

    @computed
    get importInfos() {
        if (!this.meta || this.meta.infosReviewed) {
            return [];
        }
        return this.meta.infos || [];
    }

    @action
    setWarningsReviewed(reviewed: boolean = true) {
        if (this.meta && this.meta.warningsReviewed !== reviewed) {
            this.store.updateMeta(this, { warningsReviewed: reviewed });
        }
    }

    @action
    setInfosReviewed(reviewed: boolean = true) {
        if (this.meta && this.meta.infosReviewed !== reviewed) {
            this.store.updateMeta(this, { infosReviewed: reviewed });
        }
    }

    /**
     * Available only for imported events
     * @returns the row number of the event in the import file
     */
    get nr(): number | undefined {
        return this.meta?.rowNr;
    }

    @action
    validate() {
        if (!this.id) {
            return;
        }
        const result = JoiEvent.validate(this.props, {
            abortEarly: false,
            messages: JoiMessages
        });
        if (!this.initialValidation) {
            this.initialValidation = true;
        }
        if (result.error) {
            this._errors = result.error;
            console.log(result.error);
        } else {
            this._errors = undefined;
        }
    }

    @computed
    get validationState(): ValidState {
        if (this._errors && this._errors.details?.length > 0) {
            return ValidState.Error;
        }
        if (!this.meta?.warningsReviewed && this.meta?.warnings?.length > 0) {
            return ValidState.Warning;
        }
        if (!this.meta?.infosReviewed && this.meta?.infos?.length > 0) {
            return ValidState.Info;
        }
        if (this.overlappingEvents.length > 0) {
            return ValidState.Warning;
        }
        return ValidState.Valid;
    }

    get isValid() {
        return this.validationState === ValidState.Valid;
    }

    get canSave() {
        return this.validationState !== ValidState.Error;
    }

    @computed
    get hasOpenRegistrationPeriod() {
        return this.store.root.registrationPeriodStore.openRegistrationPeriods.some(
            (rp) =>
                rp.departmentIds.intersection(this.departmentIdsAll).size > 0 &&
                rp.eventRangeStart <= this.start &&
                rp.eventRangeEnd >= this.start
        );
    }

    /**
     * This only! returns wheter this event can be further transitioned from
     * its current state. It makes **no** statement about wheter it's allowed
     * to transition or not.
     */
    @computed
    get canTransition(): boolean {
        if (this.isDraft || this.isReview) {
            return true;
        }
        return false;
    }

    @computed
    get transitionAllowed(): TransitionState {
        if (!this.initialValidation) {
            return { allowed: false, reason: InvalidTransition.InitialValidation };
        }
        if (this.validationState === ValidState.Error) {
            return { allowed: false, reason: InvalidTransition.Validation };
        }
        if (this.hasOpenRegistrationPeriod) {
            return { allowed: true };
        }
        // a new version is allowed to be transitioned
        if (this.hasParent && (this.parent?.isPublished || this.parent?.isReview)) {
            return { allowed: true };
        }
        // an event with unknown classes/classGroups should be allowed too
        if (
            this.affectedDepartments.length === 0 &&
            this.affectedKnownClasses.size === 0 &&
            (this.unknownClassGroups.length > 0 || this.affectedClassNames.size > 0)
        ) {
            return { allowed: true };
        }
        return { allowed: false, reason: InvalidTransition.NoOpenRegistrationPeriod };
    }

    errorFor(attr: keyof EventProps) {
        if (this._errors) {
            const error = this._errors.details.find((e) => e.context?.key === attr);
            return error;
        }
        return undefined;
    }

    @computed
    get author() {
        return this.store.root.userStore.find<User>(this.authorId);
    }

    @computed
    get firstAuthor() {
        if (this.publishedVersions.length > 0) {
            return this.publishedVersions[0].author;
        }
        return this.author;
    }

    @computed
    get isAllDay() {
        if (this.durationMS === 0) {
            return false;
        }
        return (
            this.start.getHours() === 0 &&
            this.start.getMinutes() === 0 &&
            this.end.getHours() === 0 &&
            this.end.getMinutes() === 0
        );
    }

    @computed
    get isOnOneDay() {
        return this.fStartDate === this.fEndDate;
    }

    @computed
    get canChangeState() {
        if (!this.isEditable) {
            return false;
        }
        switch (this.state) {
            case EventState.Draft:
                return true;
            case EventState.Review:
                return this.store.root.userStore.current?.isAdmin;
        }
        return false;
    }

    @computed
    get possibleStates(): EventState[] {
        if (!this.canChangeState) {
            return [];
        }
        switch (this.state) {
            case EventState.Draft:
                return [EventState.Review];
            case EventState.Review:
                return [EventState.Published, EventState.Refused];
            default:
                return [];
        }
    }

    @action
    requestState(state: EventState) {
        this.store.requestState([this.id], state);
    }

    @action
    toggleClass(klass: KlassName) {
        this.setClass(klass, !this.classes.has(klass));
    }

    @action
    setClass(klass: KlassName, value: boolean) {
        if (!klass || klass.length !== 4) {
            return;
        }
        const currentActive = this.classes.has(klass);
        if (!currentActive && value) {
            this.classes.add(klass);
        } else if (currentActive && !value) {
            this.classes.delete(klass);
        }
    }

    @action
    toggleClassGroup(groupName: string) {
        const isActive = this.classGroups.has(groupName);
        this.setClassGroup(groupName, !isActive);
    }

    @action
    setClassGroup(klassGroup: string, value: boolean) {
        if (!klassGroup || klassGroup.length !== 3) {
            return;
        }
        const currentActive = this.classGroups.has(klassGroup);

        if (!currentActive && value) {
            this.classGroups.add(klassGroup);
        } else if (currentActive && !value) {
            this.classGroups.delete(klassGroup);
        }
    }

    /**
     * @returns all the class names, including
     * - known (untis) class names
     * - unknown (untis) class names
     * - class names included by classGroup
     * - class names included by department
     */
    @computed
    get affectedClassNames(): Set<string> {
        const classNames = new Set<string>(this.classes);
        [...this.classGroups].forEach((cg) => {
            this.store.root.untisStore.findClassesByGroupName(cg).forEach((c) => {
                classNames.add(c.name);
            });
        });
        this.departments.forEach((d) => {
            d.classes.forEach((c) => {
                classNames.add(c.name);
            });
        });
        return classNames;
    }

    /**
     * @returns all known classes, including
     * - known (untis) class
     * - classes included by classGroup
     * - classes included by department
     *
     * unknwon classes are **not** included
     */
    @computed
    get affectedKnownClasses(): Set<Klass> {
        const klasses = new Set<Klass>(this._selectedClasses);
        [...this.classGroups].forEach((cg) => {
            this.store.root.untisStore.findClassesByGroupName(cg).forEach((c) => {
                klasses.add(c);
            });
        });
        this.departments.forEach((d) => {
            d.classes.forEach((c) => {
                klasses.add(c);
            });
        });
        return klasses;
    }

    @action
    toggleDepartment(department: Department) {
        this.setDepartment(department, !this.departmentIds.has(department.id));
    }

    @action
    setDepartmentId(departmentId: string, setActive: boolean) {
        const dep = this.store.root.departmentStore.find<Department>(departmentId);
        if (!dep) {
            return;
        }
        this.setDepartment(dep, setActive);
    }

    @action
    setDepartment(department: Department, setActive: boolean) {
        if (!department) {
            return;
        }
        const currentActive = this.departmentIds.has(department.id);
        if (currentActive && !setActive) {
            this.departmentIds.delete(department.id);
        } else if (!currentActive && setActive) {
            this.departmentIds.add(department.id);
        }
    }

    /**
     * @returns departments of the event which are included through the #departmentIds
     */
    @computed
    get departments() {
        return this.store.getDepartments([...this.departmentIds]);
    }

    /**
     * @returns all departments of the event, inlcuding the departments of the classes
     */
    @computed
    get affectedDepartments() {
        const depIds = new Set([...this.departmentIds, ...this.untisClasses.map((c) => c.departmentId)]);
        return this.store.getDepartments([...depIds]);
    }

    @computed
    get currentGradeYear() {
        return currentGradeYear(this.start);
    }

    /**
     * describes how many grade years should be additionally affected by this event.
     */
    @computed
    get gradeYearRange() {
        return currentGradeYear(this.end) - this.currentGradeYear;
    }

    @computed
    get affectedClassGroups() {
        const classGroups = new Set<string>(this.classGroups);
        this.departments.forEach((d) => {
            const isActive = this.store
                .getDepartmentsByLetter(d.letter)
                .map((d) => d.id)
                .every((id) => this.departmentIds.has(id));
            if (!isActive) {
                return;
            }
            for (let i = 0; i < d.schoolYears; i++) {
                const year = `${this.currentGradeYear + i}`.slice(2);
                const group = `${year}${d.letter}`;
                classGroups.add(group);
            }
        });
        return classGroups;
    }

    /**
     * Returns all department ids of the event and its classes
     */
    @computed
    get departmentIdsAll() {
        return new Set(this.affectedDepartments.map((d) => d.id));
    }

    @computed
    get departmentNames() {
        return this.affectedDepartments.map((d) => d.name);
    }

    @computed
    get isDraft() {
        return this.state === EventState.Draft;
    }

    @computed
    get isPublished() {
        return this.state === EventState.Published;
    }

    @computed
    get isRefused() {
        return this.state === EventState.Refused;
    }

    @computed
    get isReview() {
        return this.state === EventState.Review;
    }

    @action
    setAudience(audience: EventAudience) {
        this.audience = audience;
    }

    @action
    setExpanded(expanded: boolean) {
        this.store.root.viewStore.setEventExpanded(this.id, expanded);
    }

    @computed
    get isExpanded() {
        if (this.isDeleted) {
            return false;
        }
        return this.store.root.viewStore.expandedEventIds.has(this.id);
    }

    @action
    setEditing(editing: boolean) {
        this._isEditing = editing;
        this.triggerInitialValidation();
    }

    get isEditable() {
        return !this.isDeleted && this.store.canEdit(this);
    }

    @computed
    get isDeletable() {
        return this.store.canDelete(this);
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

    static fDate(date: Date): string {
        return formatDate(date);
    }

    @computed
    get fStartTime() {
        return formatTime(this.start);
    }

    @computed
    get fEndTime() {
        if (this.durationMS > 0 && this.end.getHours() === 0 && this.end.getMinutes() === 0) {
            return '24:00';
        }
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

    /**
     * @example 17.05.2024
     */
    get fStartDateLong() {
        return formatDateLong(this.start);
    }

    /**
     * @example 17.05.24
     */
    @computed
    get fStartDate() {
        const fDate = this.fStartDateLong;
        return `${fDate.slice(0, 6)}${fDate.slice(8)}`;
    }

    /**
     * @example 17.05.2024
     */
    get fEndDateLong() {
        if (this.isAllDay) {
            return formatDateLong(new Date(this.end.getTime() - 1));
        }
        return formatDateLong(this.end);
    }

    /**
     * @example 17.05.24
     */
    @computed
    get fEndDate() {
        const fDate = this.fEndDateLong;
        return `${fDate.slice(0, 6)}${fDate.slice(8)}`;
    }

    @action
    setAllDay(allDay: boolean) {
        this.showAsAllDay = allDay;
        if (allDay) {
            const dEnd = new Date(toGlobalDate(this.end).getTime() - 1);
            dEnd.setUTCHours(24, 0, 0, 0);
            this.update({ end: dEnd.toISOString() });
        }
        if (!allDay) {
            const d = new Date(this.end.getTime() - 1);
            this.update({ end: toGlobalDate(d).toISOString() });
        }
    }

    @computed
    get fClasses(): { text: string; classes: Klass[] }[] {
        const kls: { [year: string]: Klass[] } = {};
        const refYear = this.start.getFullYear() + (this.start.getMonth() > 6 ? 1 : 0);
        [...this.affectedKnownClasses]
            .filter((c) => c.year >= refYear)
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach((c) => {
                const year = c.isLegacyFormat ? c.displayName.slice(0, 2) : c.displayName.slice(0, 3);
                if (!kls[year]) {
                    kls[year] = [];
                }
                kls[year].push(c);
            });
        const composed = Object.keys(kls).map((year) => ({
            text: `${year}${kls[year]
                .map((c) => c.displayName.slice(year.length))
                .sort()
                .join('')}`,
            classes: kls[year]
        }));

        return [
            ...this._unknownClassNames.map((c) => ({
                text: this.store.root.departmentStore.formatClassName(c),
                classes: []
            })),
            ...composed
        ];
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

    /**
     * Calendar week of the events **start** date
     */
    @computed
    get kw() {
        return getKW(this.start);
    }

    /**
     * Year + Calendar week of the event, separated by e '-'
     * **start** date
     * @example 2023-43 => year 2023, KW 43
     */
    @computed
    get yearsKw() {
        const kw = `${this.kw}`.padStart(2, '0');
        return `${this.year}-${kw}`;
    }

    /**
     * Calendar week of the events **end** date
     */
    @computed
    get kwEnd() {
        return getKW(this.end);
    }

    get isCurrentWeek() {
        return this.yearsKw === CURRENT_YYYY_KW;
    }

    @computed
    get isToday() {
        return this.fStartDate === formatDate(new Date()) || dateBetween(new Date(), this.start, this.end);
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
    get dayStart(): (typeof DAYS)[number] {
        return DAYS[this.start.getDay()];
    }

    @computed
    get dayEnd(): (typeof DAYS)[number] {
        /**
         * subtract a millisecond to take in account, that the 1.1.2024-24:00 is in JS the 2.1.2024-00:00
         */
        const newDate = new Date(this.end.getTime() - 1);
        return DAYS[newDate.getDay()];
    }

    @computed
    get dayFullStart(): (typeof DAYS_LONG)[number] {
        return DAYS_LONG[this.start.getDay()];
    }

    @computed
    get dayFullEnd(): (typeof DAYS_LONG)[number] {
        const newDate = new Date(this.end.getTime() - 1);
        return DAYS_LONG[newDate.getDay()];
    }

    /**
     * Returns the calendar year of the start of the event
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

    affectsClass(klass: Klass): boolean {
        return this.affectsClassId(klass.id);
    }

    affectsClassId(klassId: number): boolean {
        return this.untisClasses.some((c) => c.id === klassId);
    }

    hasOverlap(lesson: Lesson) {
        if (!lesson) {
            return false;
        }
        const { weeks, minutes } = this.duration;
        const dayOffset = (lesson.weekDay + weeks * 7 - this.weekDay) % 7;
        const startOffset =
            dayOffset * 24 * 60 + Math.floor(lesson.startHHMM / 100) * 60 + (lesson.startHHMM % 100);
        const endOffset =
            dayOffset * 24 * 60 + Math.floor(lesson.endHHMM / 100) * 60 + (lesson.endHHMM % 100);
        const eventStartOffset = this.start.getHours() * 60 + this.start.getMinutes();
        return startOffset < eventStartOffset + minutes && endOffset > eventStartOffset;
    }

    @computed
    get overlappingEvents() {
        return this.store.events.filter((e) => {
            if (
                e.id === this.id ||
                (this.parentId && this.parentId === e.id) ||
                !(e.state === EventState.Published || e.state === EventState.Review)
            ) {
                return false;
            }
            if (e.parentId || e.isDeleted) {
                return false;
            }
            if (e.startTimeMs >= this.endTimeMs || e.endTimeMs <= this.startTimeMs) {
                return false;
            }
            return this.untisClasses.some((c) => e.affectsClass(c));
        });
    }

    @computed
    get isAffectedByUser() {
        return this.store.affectsUser(this);
    }

    /**
     * returns **only** the classes that are selected through the className filter **and** which
     * are present as a UntisClass
     */
    @computed
    get _selectedClasses(): Klass[] {
        const wildcard = new Set(this._wildcardClasses.map((c) => c.id));
        const refYear = this.start.getFullYear() + (this.start.getMonth() > 6 ? 1 : 0);
        return this.untisClasses.filter((c) => !wildcard.has(c.id)).filter((k) => k.year >= refYear);
    }

    @computed
    get _unknownClassNames(): KlassName[] {
        const refYear = this.start.getFullYear() + (this.start.getMonth() > 6 ? 1 : 0);
        const known = new Set(this.untisClasses.filter((c) => c.year >= refYear).map((c) => c.name));
        return [...this.classes].filter((c) => !known.has(c));
    }

    @computed
    get unknownClassGroups(): string[] {
        const refYear = this.start.getFullYear() + (this.start.getMonth() > 6 ? 1 : 0);
        return [...this.classGroups].filter((c) => !this.store.hasUntisClassesInClassGroup(c, refYear));
    }

    /**
     * all classes that are affected by this event, but are
     * not selected thorugh the className filter
     */
    @computed
    get _wildcardClasses(): Klass[] {
        return this.store.getWildcardUntisClasses(this);
    }

    @computed
    get untisClasses(): Klass[] {
        return this.store.getUntisClasses(this);
    }

    @computed
    get affectedLessons(): Lesson[] {
        const lessons = this.untisClasses
            .map((c) => c.lessons.slice().filter((l) => this.hasOverlap(l)))
            .flat();
        return _.uniqBy(lessons, 'id').sort((a, b) => a.weekOffsetMS_start - b.weekOffsetMS_start);
    }

    get affectedLessonsGroupedByClass(): { class: string; lessons: Lesson[] }[] {
        const lessons = this.untisClasses
            .slice()
            .map((c) => c.lessons.slice().filter((l) => this.hasOverlap(l)))
            .flat();
        const affected: { [kl: string]: Lesson[] } = {};
        const placedLessonIds = new Set<number>();
        lessons.forEach((l) => {
            if (placedLessonIds.has(l.id) || l.classes.length === 0) {
                return;
            }
            placedLessonIds.add(l.id);
            l.classes.forEach((c) => {
                const name = c.displayName;
                if (!affected[name]) {
                    affected[name] = [];
                }
                const overlappingLessons = affected[name]
                    .map((lesson) => ({ overlap: lessonOverlap(lesson, l), lesson: lesson }))
                    .filter((ol) => ol.overlap !== LessonOverlap.None);
                if (overlappingLessons.length > 0) {
                    overlappingLessons.forEach((ol) => {
                        const idx = affected[name].indexOf(ol.lesson);
                        if (ol.overlap === LessonOverlap.Start) {
                            affected[name].splice(
                                idx,
                                1,
                                new Lesson(
                                    { ...ol.lesson.props, startHHMM: l.startHHMM },
                                    this.store.root.untisStore
                                )
                            );
                        } else if (ol.overlap === LessonOverlap.End) {
                            affected[name].splice(
                                idx,
                                1,
                                new Lesson(
                                    { ...ol.lesson.props, endHHMM: l.endHHMM },
                                    this.store.root.untisStore
                                )
                            );
                        }
                    });
                } else {
                    affected[name].push(l);
                }
            });
        });
        return Object.keys(affected).map((kl) => ({ class: kl, lessons: affected[kl] }));
    }

    get usersAffectedLessonsGroupedByClass(): { class: string; lessons: Lesson[] }[] {
        const lessons = this.affectedLessonsGroupedByClass;
        const tId = this.store.root.userStore.current?.untisTeacher?.id;
        if (!tId) {
            return lessons;
        }
        lessons.forEach((l) => {
            l.lessons = l.lessons.filter((l) => l.teacherIds.includes(tId));
        });
        return lessons.filter((l) => l.lessons.length > 0);
    }

    @computed
    get queryParam() {
        return `id=${this.id}`;
    }

    @computed
    get shareUrl() {
        return `/event?${this.queryParam}`;
    }

    @computed
    get isDeleted() {
        return !!this.deletedAt;
    }

    get departmentStore() {
        return this.store.root.departmentStore;
    }

    get untisStore() {
        return this.store.root.untisStore;
    }

    get departmentState(): DepartmentState {
        const someDepartments = this.departmentStore.departmentsWithClasses.some((d) =>
            this.departmentIds.has(d.id)
        );
        const allDepartments =
            someDepartments &&
            this.departmentStore.departmentsWithClasses.every((d) => this.departmentIds.has(d.id));

        const { departmentsDe, departmentsFr } = this.departmentStore;
        const someDepartmentsDe = departmentsDe.some((d) => this.departmentIds.has(d.id));
        const allDepartmentsDe =
            someDepartmentsDe && departmentsDe.every((d) => this.departmentIds.has(d.id));
        const someDepartmentsFr = departmentsFr.some((d) => this.departmentIds.has(d.id));
        const allDepartmentsFr =
            someDepartmentsFr && departmentsFr.every((d) => this.departmentIds.has(d.id));
        return {
            someDepartments,
            allDepartments,
            allDepartmentsDe,
            allDepartmentsFr,
            someDepartmentsDe,
            someDepartmentsFr
        };
    }

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
            audience: this.audience,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
            parentId: this.parentId,
            cloned: this.cloned,
            teachingAffected: this.teachingAffected,
            affectsDepartment2: this.affectsDepartment2,
            start: toGlobalDate(this.start).toISOString(),
            end: toGlobalDate(this.end).toISOString(),
            publishedVersionIds: this.publishedVersionIds,
            deletedAt: this.isDeleted ? toGlobalDate(this.deletedAt).toISOString() : null,
            clonedFromId: this.clonedFromId,
            meta: this.meta
        };
    }

    @computed
    get hasParent() {
        return !!this.parentId;
    }

    @computed
    get parent() {
        return this.store.find<Event>(this.parentId);
    }

    @computed
    get publishedParent(): Event | undefined {
        let root: Event = this.parent;
        while (root?.hasParent) {
            root = root.parent;
        }
        return root;
    }

    @computed
    get parents() {
        if (!this.parentId) {
            return [];
        }
        return [this.parent, ...this.parent.parents];
    }

    @computed
    get publishedVersions() {
        if (this.hasParent) {
            return this.publishedParent?.publishedVersions || [];
        }
        const all = this.publishedVersionIds.map((id) => this.store.find<Event>(id)).filter((e) => !!e);
        return _.orderBy(all, ['createdAt'], ['asc']);
    }

    @computed
    get versionNumber() {
        if (this.hasParent) {
            let version = 0;
            let subversion = 0;
            this.versions.every((e) => {
                if (e.state === EventState.Published) {
                    version++;
                    subversion = 0;
                } else {
                    subversion++;
                }
                return e.id !== this.id;
            });
            if (subversion > 0) {
                return version + subversion / 10;
            }
            return version;
        }
        return this.publishedVersionIds.length + 1;
    }

    @action
    loadParent(force?: boolean) {
        if (!this.hasParent || (this.parent && !force)) {
            return Promise.resolve(this.parent);
        }
        return this.store.loadEvents([this.parentId], this.parentId);
    }

    @action
    loadVersions(force?: boolean) {
        if (this.versionsLoaded && !force) {
            return;
        }
        this.store.loadVersions(this).then(
            action((versions) => {
                this.versionsLoaded = true;
            })
        );
    }

    @computed
    get versions() {
        if (this.store.root.userStore.current?.isAdmin) {
            return this.allVersions;
        }
        return this.publishedVersions;
    }

    @computed
    get allVersions() {
        const root: Event = this.publishedParent || this;
        const all = [root, ...root.descendants];
        return _.orderBy(all, ['createdAt'], ['asc']);
    }

    @computed
    get descendants(): Event[] {
        return this.children.flatMap<Event>((c) => [c, ...c.descendants]);
    }

    @computed
    get children() {
        return this.store.findChildren(this.id);
    }

    @computed
    get unpublishedVersions() {
        return this.allVersions.filter((c) => !c.isPublished);
    }

    @computed
    get hasChildren() {
        return this.children.length > 0;
    }

    @computed
    get _dupCompareString() {
        const exclude: (keyof EventProps)[] = [
            'id',
            'jobId',
            'authorId',
            'createdAt',
            'updatedAt',
            'deletedAt',
            'parentId',
            'cloned',
            'state'
        ];

        const props = (Object.keys(this.props) as (keyof EventProps)[])
            .filter((p) => {
                return !exclude.includes(p);
            })
            .reduce((acc, key) => {
                let val = this.props[key];
                if (Array.isArray(val)) {
                    val = val.sort().join(',');
                }
                return { ...acc, [key]: val };
            }, {});

        return JSON.stringify(props);
    }

    @computed
    get duplicatedEvents() {
        return this.store.publicEvents.filter(
            (e) => e._dupCompareString === this._dupCompareString && e.id !== this.id
        );
    }

    @computed
    get isDuplicate() {
        return this.duplicatedEvents.length > 0;
    }

    @computed
    get duration() {
        const period = this.durationMS;
        return {
            weeks: Math.ceil(period / WEEK_2_MS),
            days: Math.ceil(period / DAY_2_MS),
            hours: Math.ceil(period / HOUR_2_MS),
            minutes: Math.ceil(period / MINUTE_2_MS)
        };
    }

    @computed
    get fDuration() {
        if (this.store?.root?.currentLocale === 'fr') {
            return humanize(this.durationMS, { language: 'fr', units: ['w', 'd', 'h', 'm'], round: true });
        }
        return humanize(this.durationMS, { language: 'de', units: ['w', 'd', 'h', 'm'], round: true });
    }

    @computed
    get fDurationCompact() {
        if (this.store?.root?.currentLocale === 'fr') {
            return humanize(this.durationMS, {
                language: 'fr',
                units: ['w', 'd', 'h', 'm'],
                largest: 1,
                round: true
            });
        }
        return humanize(this.durationMS, {
            language: 'de',
            units: ['w', 'd', 'h', 'm'],
            largest: 1,
            round: true
        });
    }

    /**
     * @returns The day of the week of the event
     * @example 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
     */
    @computed
    get weekDay(): number {
        return this.start.getDay();
    }

    get affectedSemesters() {
        return this.store.root.semesterStore.semesters.filter(
            (s) => dateBetween(this.start, s.start, s.end) || dateBetween(this.end, s.start, s.end)
        );
    }

    @computed
    get groups() {
        return this.store.root.eventGroupStore.eventGroups.filter((g) => g.eventIds.has(this.id));
    }

    get isIgnored() {
        const { current } = this.store.root.userStore;
        if (!current || !current.subscription) {
            return false;
        }
        return current.subscription.ignoredEventIds.has(this.id);
    }

    @action
    unsubscribe() {
        const { current } = this.store.root.userStore;
        if (!current || !current.subscription) {
            return;
        }
        current.subscription.ignoreEvent(this.id);
    }

    @action
    resubscribe() {
        const { current } = this.store.root.userStore;
        if (!current || !current.subscription) {
            return;
        }
        if (current.subscription.ignoredEventIds.has(this.id)) {
            current.subscription.unignoreEvent(this.id);
        }
    }

    @action
    normalizeAudience() {
        return this.store.normalizeAudience(this);
    }

    cleanup(destroyed?: boolean) {
        this.validationDisposer();
        clearTimeout(this.validationTimeout);
        if (destroyed) {
            this.groups.forEach((eg) => eg.triggerReload());
        }
    }
}
