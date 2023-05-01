import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import Semester from '../models/Semester';
import User from '../models/User';
import Lesson from '../models/Untis/Lesson';
import { EventState } from '../api/event';

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
    activeGroup: string | null = null;

    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @action
    setActiveGroup(kw: string | null): void {
        this.activeGroup = kw;
    }

    @computed
    get events() {
        const {semester} = this.store;
        if (!semester) {
            return [];
        }
        return semester.events.filter((event) => {
            if (event.state !== EventState.Published) {
                return false;
            }
            let keep = true;
            if (keep && this.departmentIds.size > 0) {
                keep = [...event.departmentIds].some((d) => this.departmentIds.has(d));
            }
            if (keep && this.klasses.size > 0) {
                keep = [...event.classes].some((d) => [...this.klasses].some((k) => d.startsWith(k)));
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
        console.log([...this.klasses]);
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
        return this.events.some((e) => e.editing);
    }
}

export class ViewStore {
    private readonly root: RootStore;

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

    
    expandedEventIds = observable.set<string>();

    constructor(store: RootStore) {
        this.root = store;
        this.eventTable = new EventTable(this);
        makeObservable(this);
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
    get untisSemesterName(): `${number}HS` | `${number}FS`{
        return this.semester?.semesterName ?? '0HS';
    }

    @computed
    get usersLessons(): Lesson[] {
        return this.root.untisStore.findLessonsByTeacher(this.user?.untisId || -1).filter((l) => l.semesterName === this.semester?.semesterName);
    }

}
