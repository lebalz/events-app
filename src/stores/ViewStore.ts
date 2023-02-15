import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import iStore from './iStore';
import { EventStore } from './EventStore';
import { Departments } from '../api/event';

class EventTable {
    private readonly store: EventStore;

    departments = observable.set<Departments>();

    constructor(store: EventStore) {
        this.store = store;
        makeObservable(this);
    }

    @computed
    get events() {
        return this.store.publishedAndMine.filter((event) => {
            if (this.departments.size === 0) {
                return true;
            }
            return event.departments.some((d) => this.departments.has(d));
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
