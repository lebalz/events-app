import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import iStore from './iStore';

export class ViewStore implements iStore<undefined> {
    private readonly root: RootStore;
    constructor(store: RootStore) {
        this.root = store;
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
