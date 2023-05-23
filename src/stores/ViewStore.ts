import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { RootStore } from './stores';
import Semester from '../models/Semester';
import User from '../models/User';
import Lesson from '../models/Untis/Lesson';
import { EventState } from '../api/event';
import _ from 'lodash';
import Department from '../models/Department';

/**
 * route: /table
 */
class EventTable {
    private readonly store: ViewStore;

    /** filter props */
    klasses = observable.set<string>();
    @observable
    klassFilter = '';

    @observable
    start: Date | null = null;
    @observable
    end: Date | null = null;
    departmentIds = observable.set<string>();

    @observable
    onlyMine = false;

    @observable
    activeGroup: string | null = null;


    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
        reaction(
            () => this.store.root.sessionStore.loggedIn,
            (loggedIn) => {
                if (loggedIn && !this.onlyMine) {
                    this.setOnlyMine(true);
                } else if (!loggedIn && this.onlyMine) {
                    this.setOnlyMine(false);
                }
            }
        );
    }

    @action
    toggleOnlyMine(): void {
        this.setOnlyMine(!this.onlyMine);
    }

    @action
    setOnlyMine(onlyMine: boolean): void {
        this.onlyMine = onlyMine;
    }

    @action
    setActiveGroup(kw: string | null): void {
        this.activeGroup = kw;
    }

    @computed
    get events() {
        const { semester } = this.store;
        if (!semester) {
            return [];
        }
        return semester.events.filter((event) => {
            if (event.state !== EventState.Published) {
                return false;
            }
            let keep = true;
            if (this.onlyMine && !event.isAffectedByUser) {
                keep = false;
            }
            if (keep && this.departmentIds.size > 0) {
                keep = [...event.departmentIdsAll].some((d) => this.departmentIds.has(d));
            }
            if (keep && this.klasses.size > 0) {
                const kls = [...this.klasses]
                keep = [...event.classes, ...event.untisClasses.map(uc => uc.legacyName).filter(c=>!!c)].some((d) => kls.some((k) => d.startsWith(k)));
            }
            if (keep && this.start) {
                keep = event.end >= this.start;
            }
            if (keep && this.end) {
                keep = event.start <= this.end;
            }
            return keep;
        });
    }

    @action
    toggleDepartment(departmentId: string): void {
        if (this.departmentIds.has(departmentId)) {
            this.departmentIds.delete(departmentId);
        } else {
            this.departmentIds.add(departmentId);
        }
    }

    @action
    setClassFilter(filter: string) {
        this.klassFilter = filter;
        this.klasses.clear();
        filter.split(/[,|;|\s]+/).forEach((f) => {
            if (f) {
                this.klasses.add(f);
            }
        });
    }

    @action
    setStartFilter(date: Date | null): void {
        this.start = date;
    }

    @action
    setEndFilter(date: Date | null): void {
        this.end = date;
    }

    @computed
    get isEditing(): boolean {
        return this.events.some((e) => e.isEditing);
    }
}

class AdminUserTable {
    private readonly store: ViewStore;
    @observable
    sortColumn: 'id' | 'email' | 'shortName' | 'role' | 'createdAt' | 'updatedAt' = 'email';
    @observable
    sortDirection: 'asc' | 'desc' = 'asc';
    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @computed
    get users(): User[] {
        return _.orderBy(this.store.root.userStore.models, [this.sortColumn], [this.sortDirection]);
    }

    @action
    setSortColumn(column: 'id' | 'email' | 'shortName' | 'role' | 'createdAt' | 'updatedAt'): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }
}

class AdminDepartmentTable {
    private readonly store: ViewStore;
    @observable
    sortColumn: 'name' | 'color' | 'createdAt' | 'updatedAt' = 'name';
    @observable
    sortDirection: 'asc' | 'desc' = 'asc';
    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }


    @computed
    get departments(): Department[] {
        return _.orderBy(this.store.root.departmentStore.departments, [(d) => d.pristine[this.sortColumn]], [this.sortDirection]);
    }

    @action
    setSortColumn(column: 'name' | 'color' | 'createdAt' | 'updatedAt'): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
    }
}

export class ViewStore {
    readonly root: RootStore;

    @observable
    showFullscreenButton = false;
    @observable
    fullscreen = false;

    @observable.ref
    eventTable: EventTable;

    @observable
    _semesterId = '';

    @observable
    _userId: string | null = null;

    @observable.ref
    adminUserTable: AdminUserTable;
    @observable.ref
    adminDepartmentTable: AdminDepartmentTable;

    @observable
    openEventModalId?: string;

    expandedEventIds = observable.set<string>();

    constructor(store: RootStore) {
        this.root = store;
        this.eventTable = new EventTable(this);
        this.adminUserTable = new AdminUserTable(this);
        this.adminDepartmentTable = new AdminDepartmentTable(this);
        makeObservable(this);
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
        if ((expanded && !this.expandedEventIds.has(eventId))
            || !expanded && this.expandedEventIds.has(eventId)) {
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
        this._semesterId = semester.id;
    }

    @action
    nextSemester(direction: number = 1): void {
        const offset = direction > 0 ? -1 : 1;
        const semester = this.root.semesterStore.nextSemester(this.semesterId, offset);
        this._semesterId = semester?.id || '';
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
    get usersLessons(): Lesson[] {
        return this.root.untisStore.findLessonsByTeacher(this.user?.untisId || -1).filter((l) => l?.semesterName === this.semester?.semesterName);
    }

}
