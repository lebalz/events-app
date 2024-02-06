import {
    AccountInfo,
    IPublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';

class State {    
    @observable.ref
    account?: AccountInfo | null = undefined;

    @observable.ref
    _msalInstance?: IPublicClientApplication;

    constructor() {
        makeObservable(this);
    }
}

export class SessionStore {
    private readonly root: RootStore;
    @observable.ref
    private state: State = new State();

    @observable
    initialized = false;
    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
    }

    get locale() {
        return this.root.currentLocale;
    }

    @computed
    get account(): AccountInfo | null | undefined {
        return this.state.account;
    }

    @action
    setAccount(account?: AccountInfo | null) {
        this.state.account = account;
    }

    @computed
    get isStudent(): boolean {
        return this.account?.username?.includes('@edu.') ?? false;
    }

    @computed
    get loggedIn(): boolean {
        return !!this.state.account;
    }
}
