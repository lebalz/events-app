import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import iStore from './iStore';
import { EventStore } from './EventStore';
import Department from '../models/Department';

const MIN_TABLE_WIDTH = 1450;
const MIN_COLUMN_WIDTH_EM = {
    description: 18,
    location: 7,
    descriptionLong: 30
};

/**
 * route: /table
 */
class EventTable {
    private readonly store: EventStore;

    departmentIds = observable.set<number>();
    @observable
    clientWidth = 900;
    @observable
    baseFontSize = 16;

    constructor(store: EventStore) {
        this.store = store;
        makeObservable(this);
    }

    @action
    setClientWidth(width: number): void {
        if (width !== this.clientWidth) {
            this.clientWidth = width;
            console.log('setClientWidth', width);
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
            return `${MIN_COLUMN_WIDTH_EM[colName]}em`;
        }
        const total = Object.values(MIN_COLUMN_WIDTH_EM).reduce((a, b) => a + b, 0) * this.baseFontSize;
        const dt = this.clientWidth - MIN_TABLE_WIDTH;
        const colBase = MIN_COLUMN_WIDTH_EM[colName] * this.baseFontSize;
        const width = dt * (colBase / total) + colBase;
        return `${width}px`;
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
        return this.store.publishedAndMine.filter((event) => {
            if (this.departmentIds.size === 0) {
                return true;
            }
            return event.departmentIds.some((d) => this.departmentIds.has(d));
        });
    }
}

export class ViewStore implements iStore<undefined> {
    private readonly root: RootStore;

    @observable
    showFullscreenButton = false;
    @observable
    fullscreen = false;

    @observable.ref
    eventTable: EventTable;
    constructor(store: RootStore) {
        this.root = store;
        this.eventTable = new EventTable(this.root.eventStore);
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

    @action
    load(): Promise<undefined> {
        return Promise.resolve(undefined);
    }

    @action
    reset(): void {
    }

    @action
    resetEventTableState() {
    }

}
