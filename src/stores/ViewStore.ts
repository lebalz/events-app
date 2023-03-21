import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import iStore from './iStore';
import { EventStore } from './EventStore';
import Department from '../models/Department';
import Semester from '../models/Semester';
import User from '../models/User';
import Lesson from '../models/Untis/Lesson';

const MIN_TABLE_WIDTH = 1450;
const MIN_COLUMN_WIDTH_EM = {
    description: 18,
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

    maxWidth(colName: keyof typeof MIN_COLUMN_WIDTH_EM): string {
        if (this.clientWidth < MIN_TABLE_WIDTH) {
            return `min(${MIN_COLUMN_WIDTH_EM[colName]}em, ${MAX_COLUMN_WIDTH})`;
        }
        const total = Object.values(MIN_COLUMN_WIDTH_EM).reduce((a, b) => a + b, 0) * this.baseFontSize;
        const dt = this.clientWidth - MIN_TABLE_WIDTH;
        const colBase = MIN_COLUMN_WIDTH_EM[colName] * this.baseFontSize;
        const width = dt * (colBase / total) + colBase;
        return `min(${width}px, ${MAX_COLUMN_WIDTH})`;
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

    constructor(store: RootStore) {
        this.root = store;
        this.eventTable = new EventTable(this);
        makeObservable(this);
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
    get usersLessons(): Lesson[] {
        return this.root.untisStore.findLessonsByTeacher(this.user?.untisId || -1).filter((l) => l.semester === this.semester.untisSemester);
    }

}
