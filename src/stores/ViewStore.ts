import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import Semester from '../models/Semester';
import User from '../models/User';
import Lesson from '../models/Untis/Lesson';

const MIN_TABLE_WIDTH = 1600;
const MIN_COLUMN_WIDTH_EM = {
    description: 15,
    location: 7,
    descriptionLong: 28
};
const MAX_COLUMN_WIDTH = 'calc(95vw - 8em)';

/**
 * route: /table
 */
class EventTable {
    private readonly store: ViewStore;

    departmentIds = observable.set<string>();
    @observable
    clientWidth = 900;
    @observable
    baseFontSize = 16;
    

    constructor(store: ViewStore) {
        this.store = store;
        makeObservable(this);
    }

    @action
    setClientWidth(width: number): void {
        if (width !== this.clientWidth) {
            this.clientWidth = width;
        }
    }

    @action
    setBaseFontSize(size: number): void {
        if (size !== this.baseFontSize) {
            this.baseFontSize = size;
        }
    }

    colWidth(colName: keyof typeof MIN_COLUMN_WIDTH_EM): { width: number, unit: 'em' | 'px' } {
        if (this.clientWidth < MIN_TABLE_WIDTH) {
            return {width: MIN_COLUMN_WIDTH_EM[colName], unit: 'em'};
        }
        let offset = 0;
        if (colName === 'descriptionLong' && this.isEditing) {
            offset = 4;
        }
        const total = Object.values(MIN_COLUMN_WIDTH_EM).reduce((a, b) => a + b, 0) * this.baseFontSize;
        const dt = this.clientWidth - MIN_TABLE_WIDTH;
        const colBase = (MIN_COLUMN_WIDTH_EM[colName] - offset) * this.baseFontSize;
        const width = dt * (colBase / total) + colBase;
        return {width: width, unit: 'px'};
    }

    maxWidth(colName: keyof typeof MIN_COLUMN_WIDTH_EM): string {
        const {width, unit} = this.colWidth(colName);
        return `min(${width}${unit}, ${MAX_COLUMN_WIDTH})`;
    }

    @computed
    get maxWidthDescription(): string {
        return this.maxWidth('description');
    }

    @computed
    get maxWidthDescriptionLong(): string {
        return this.maxWidth('descriptionLong');
    }

    @computed
    get maxWidthLocation(): string {
        return this.maxWidth('location');
    }

    @computed
    get events() {
        const {semester} = this.store;
        if (!semester) {
            return [];
        }
        return semester.events.filter((event) => {
            if (this.departmentIds.size === 0) {
                return true;
            }
            return event.departmentIds.some((d) => this.departmentIds.has(d));
        });
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
