import { action, computed, observable, reaction } from 'mobx';
import { RootStore } from '../stores';
import Semester from '../../models/Semester';
import User from '../../models/User';
import Event from '../../models/Event';
import Lesson from '../../models/Untis/Lesson';
import _ from 'lodash';
import { LoadeableStore, ResettableStore } from '../iStore';
import EventTable, { EventViewProps } from './EventTable';
import AdminUserTable from './AdminUserTable';
import AdminDepartmentTable from './AdminDepartmentTable';
import { EventState } from '@site/src/api/event';
import Klass from '@site/src/models/Untis/Klass';
import Department from '@site/src/models/Department';
import Colors from './Colors';
import {
    ClassGroupOption,
    ClassOption,
    DepartmentOption,
    Option
} from '@site/src/components/shared/AudiencePicker/ClassSelector';
import { GroupBase } from 'react-select';

export class ViewStore implements ResettableStore, LoadeableStore<any> {
    readonly root: RootStore;

    @observable accessor showFullscreenButton = false;
    @observable accessor fullscreen = false;

    @observable.ref accessor eventTable: EventTable;

    @observable accessor _semesterId = '';

    @observable accessor _userId: string | null = null;

    @observable.ref accessor adminUserTable: AdminUserTable;
    @observable.ref accessor adminDepartmentTable: AdminDepartmentTable;
    @observable.ref accessor colors: Colors;
    @observable accessor openEventModalId: string | undefined;

    @observable accessor initialAuthorizedLoadPerformed = false;

    get initialPublicLoadPerformed() {
        return this.initialAuthorizedLoadPerformed;
    }

    get initialLoadPerformed() {
        return this.initialPublicLoadPerformed && this.initialAuthorizedLoadPerformed;
    }

    @observable accessor icalListDepartmentsFilter = '';

    @observable accessor icalListClassFilter = '';

    @observable accessor calendarViewDate = new Date().toISOString().split('T')[0];

    expandedEventIds = observable.set<string>();

    constructor(store: RootStore) {
        this.root = store;
        this.eventTable = new EventTable(this);
        this.colors = new Colors(this);
        this.adminUserTable = new AdminUserTable(this);
        this.adminDepartmentTable = new AdminDepartmentTable(this);

        reaction(
            () => this.semesterId,
            (semesterId) => {
                if (semesterId) {
                    const teacher = this.root.userStore?.current?.untisTeacher;
                    if (teacher) {
                        /**
                         * configure the filter for this user
                         */
                        this.root.viewStore.eventTable.setDepartmentIds(teacher.departments.map((d) => d.id));
                    }
                }
            }
        );
    }

    usersEvents = ({
        states = undefined,
        jobId = undefined,
        ignoreImported = undefined,
        onlyImported = undefined,
        onlyDeleted = undefined,
        ignoreDeleted = undefined,
        orderBy = undefined
    }: EventViewProps): Event[] => {
        return this.allEvents({
            user: this.user,
            jobId,
            states,
            ignoreImported,
            onlyDeleted,
            ignoreDeleted,
            onlyImported,
            orderBy
        });
    };

    allEvents = ({
        user = undefined,
        jobId = undefined,
        states = undefined,
        ignoreImported = undefined,
        onlyImported = undefined,
        onlyDeleted = undefined,
        ignoreDeleted = undefined,
        orderBy = undefined
    }: EventViewProps) => {
        let events = user
            ? user.events
            : jobId
              ? this.root.eventStore.byJob(jobId)
              : (this.root.eventStore?.events ?? []);
        events = events.filter((e) => !(e.hasParent && e.state === EventState.Published));
        if (ignoreImported) {
            events = events.filter((e) => !e.jobId);
        } else if (onlyImported) {
            events = events.filter((e) => !!e.jobId);
        }
        if (onlyDeleted) {
            events = events.filter((e) => e.isDeleted);
        }
        if (ignoreDeleted) {
            events = events.filter((e) => !e.isDeleted);
        }
        if (states) {
            const eState = new Set(states);
            events = events.filter((e) => eState.has(e.state));
        }
        if (orderBy) {
            const [col, direction] = orderBy.split('-');
            if (col === 'start') {
                if (direction === 'asc') {
                    /** already correctly ordered */
                } else {
                    events = events.slice().reverse();
                }
            } else if (col === 'isValid') {
                events = _.orderBy(events, ['isValid', 'startTimeMs'], [direction as 'asc' | 'desc', 'asc']);
            }
        }
        return events;
    };

    @computed
    get adminReviewEvents() {
        if (!this.root.userStore.current?.isAdmin) {
            return [];
        }
        return this.allEvents({ states: [EventState.Review] });
    }

    @computed
    get inReviewEvents() {
        return this.usersEvents({
            ignoreImported: true,
            ignoreDeleted: true,
            states: [EventState.Review, EventState.Refused]
        });
    }

    @computed
    get draftEvents() {
        return this.usersEvents({
            ignoreImported: true,
            ignoreDeleted: true,
            states: [EventState.Draft]
        });
    }

    @computed
    get todayEvents() {
        return this.root.eventStore.events.filter((e) => e.isToday && e.isPublished && !e.hasParent);
    }

    @computed
    get todayEventsForUser() {
        return this.todayEvents.filter((e) => e.isAffectedByUser);
    }

    @action
    setCalendarViewDate(date: Date) {
        this.calendarViewDate = date.toISOString().split('T')[0];
        const viewedSemester = this.semester;
        /**
         * Side-Effect: Change the viewed semester if the date is not in the current semester
         */
        if (date < viewedSemester.start) {
            const idx = this.root.semesterStore.semesters.findIndex((s) => s.id === viewedSemester.id);
            if (idx < this.root.semesterStore.semesters.length - 1) {
                this.setSemester(this.root.semesterStore.semesters[idx + 1]);
            }
        } else if (date > viewedSemester.end) {
            const idx = this.root.semesterStore.semesters.findIndex((s) => s.id === viewedSemester.id);
            if (idx > 0) {
                this.setSemester(this.root.semesterStore.semesters[idx - 1]);
            }
        }
    }

    @action
    setEventModalId(modalId?: string): void {
        this.openEventModalId = modalId;
    }

    @action
    toggleExpandedEvent(eventId: string): void {
        if (this.expandedEventIds.has(eventId)) {
            this.expandedEventIds.delete(eventId);
        } else {
            this.expandedEventIds.add(eventId);
        }
    }

    @action
    setEventExpanded(eventId: string, expanded: boolean): void {
        if (
            (expanded && !this.expandedEventIds.has(eventId)) ||
            (!expanded && this.expandedEventIds.has(eventId))
        ) {
            this.toggleExpandedEvent(eventId);
        }
    }

    @action
    setShowFullscreenButton(show: boolean): void {
        this.showFullscreenButton = show;
    }

    @action
    setFullscreen(fullscreen: boolean): void {
        this.fullscreen = fullscreen;
    }

    @computed
    get semesterId(): string {
        return this._semesterId || this.root.semesterStore.currentSemester?.id || '';
    }

    @action
    setSemester(semester: Semester): void {
        if (!semester) {
            this._semesterId = '';
            return;
        }
        this._semesterId = semester.id;
    }

    @action
    nextSemester(direction: number = 1): void {
        const offset = direction > 0 ? -1 : 1;
        const semester = this.root.semesterStore.nextSemester(this.semesterId, offset);
        this.setSemester(semester);
    }

    @computed
    get user(): User | undefined {
        if (!this._userId) {
            return this.root.userStore.current;
        }
        return this.root.userStore.find(this._userId);
    }

    @computed
    get semester(): Semester {
        return this.root.semesterStore.find(this.semesterId);
    }

    @computed
    get untisSemesterName(): `${number}HS` | `${number}FS` {
        return this.semester?.semesterName ?? '0HS';
    }

    @computed
    get allUserLessons(): Lesson[] {
        return this.root.untisStore
            .findLessonsByTeacher(this.user?.untisId || -1)
            .filter((l) => l?.semesterId === this.semester?.id);
    }

    @computed
    get usersLessons(): Lesson[] {
        return this.allUserLessons.filter((l) => l.semesterId === this.semesterId);
    }

    @action
    loadPublic(semesterId?: string) {
        return Promise.resolve();
    }

    @action
    loadAuthorized() {
        this.initialAuthorizedLoadPerformed = true;
        if (this.root.userStore.current?.untisId) {
            // this.eventTable.setOnlyMine(true);
        }
        return Promise.resolve();
    }

    @action
    resetUserData() {
        // this.eventTable.setOnlyMine(false);
    }

    @action
    setIcalListDepartmentsFilter(departments: string) {
        this.icalListDepartmentsFilter = departments;
    }

    @computed
    get icalListDepartmentsFiltered() {
        const match = (dep: Department, s: string) =>
            dep.shortName.toLowerCase().includes(s) || dep.name.toLowerCase().includes(s);
        return this.root.departmentStore.departments.filter((d) =>
            match(d, this.icalListDepartmentsFilter.toLowerCase())
        );
    }

    @action
    setIcalListClassFilter(classes: string) {
        this.icalListClassFilter = classes;
    }

    @computed
    get icalListClassesFiltered() {
        const match = (klass: Klass, s: string) => klass.legacyName?.includes(s) || klass.name.includes(s);
        return this.root.untisStore.classes.filter((c) => match(c, this.icalListClassFilter));
    }

    @computed
    get audienceOptions(): GroupBase<Option>[] {
        return [
            {
                label: 'Abteilungen',
                options: this.root.departmentStore.departments.map((d) => {
                    return {
                        label: d.name,
                        value: d.id,
                        type: 'departmentType',
                        model: d
                    } as DepartmentOption;
                })
            },
            {
                label: 'Stufen',
                options: _.orderBy(
                    [
                        ...this.root.untisStore.classGroups.map((g) => {
                            return {
                                label: `${g}*`,
                                value: g,
                                type: 'classGroup'
                            } as ClassGroupOption;
                        })
                    ],
                    ['label'],
                    ['asc']
                )
            },
            {
                label: 'Klassen',
                options: _.orderBy(
                    [
                        ...this.root.untisStore.currentClasses.map((c) => {
                            return {
                                label: c.displayName,
                                value: c.name,
                                type: 'classType',
                                model: c
                            } as ClassOption;
                        })
                    ],
                    ['label'],
                    ['asc']
                )
            }
        ];
    }
}
