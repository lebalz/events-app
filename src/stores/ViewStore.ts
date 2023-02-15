import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import iStore from './iStore';
import { EventStore } from './EventStore';
import { Departments } from '../api/event';

export type SCHOOL = 'GYM' | 'FMS' | 'WMS';

export const department2school = (department: Departments): SCHOOL => {
    switch (department) {
        case Departments.GBSL:
        case Departments.GBJB:
            return 'GYM';
        case Departments.FMS:
        case Departments.FMPaed:
        case Departments.ECG:
        case Departments.MSOP:
            return 'FMS';
        case Departments.WMS:
        case Departments.ESC:
            return 'WMS';
    }
}
export const school2departments = (school: SCHOOL): Departments[] => {
    switch (school) {
        case 'GYM':
            return [Departments.GBSL, Departments.GBJB];
        case 'FMS':
            return [Departments.FMS, Departments.FMPaed, Departments.ECG, Departments.MSOP]
        case 'WMS':
            return [Departments.WMS, Departments.ESC]
    }
}

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
