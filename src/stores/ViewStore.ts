import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import iStore from './iStore';
import { EventStore } from './EventStore';
import { Departements } from '../api/event';

class EventTable {
    private readonly store: EventStore;

    departments = observable.set<Departements>();

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
            return event.departements.some((d) => this.departments.has(d));
        });
    }
}

export class ViewStore implements iStore<undefined> {
    private readonly root: RootStore;
    @observable.ref
    eventTable: EventTable;
    constructor(store: RootStore) {
        this.root = store;
        this.eventTable = new EventTable(this.root.eventStore);
        makeObservable(this);
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
