import axios, { CancelTokenSource } from 'axios';
import {
    AccountInfo,
    PublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable } from 'mobx';
import { loginRequest } from '../authConfig';
import { RootStore } from './stores';

class State {    
    @observable.ref
    account?: AccountInfo | null = undefined;

    @observable.ref
    _msalInstance?: PublicClientApplication;

    constructor() {
        makeObservable(this);
    }
}

export class SessionStore {
    private readonly root: RootStore;
    @observable.ref
    private state: State = new State();
    @observable
    locale: 'de' | 'fr' = 'de';

    @observable
    initialized = false;

    cancelToken: CancelTokenSource = axios.CancelToken.source();

    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
    }

    @action
    setLocale(locale: 'de' | 'fr') {
        if (locale === 'fr') {
            this.locale = 'fr';
        } else {
            this.locale = 'de';
        }
    }

    @computed
    get msalInstance(): PublicClientApplication {
        if (!this.state._msalInstance) {
            throw 'No MSAL Instance set!';
        }
        return this.state._msalInstance;
    }

    @computed
    get account(): AccountInfo | null | undefined {
        return this.state.account;
    }

    @action
    setMsalInstance(msalInstance: PublicClientApplication) {
        console.log('MSAL Instance set', msalInstance)
        this.initialized = true;
        this.state._msalInstance = msalInstance;
    }

    @action
    setAccount(account?: AccountInfo | null) {
        if (account) {
            this.state.account = account;
        } else if (!this.state.account) {
            this.state.account = account;
        }
    }

    @computed
    get isStudent(): boolean {
        return this.account?.username?.includes('@edu.') ?? false;
    }

    @computed
    get loggedIn(): boolean {
        return !!this.state.account;
    }

    @action
    login() {
        this.msalInstance.loginRedirect(loginRequest).catch((e) => {
            console.warn(e);
        });
    }

    @action
    logout() {
        if (!this.loggedIn) {
            return;
        }
        const msalInstance = this.msalInstance;
        const logoutRequest = {
            account: msalInstance.getAccountByUsername(this.state.account.username),
        };
        this.state = new State();
        msalInstance.logoutRedirect(logoutRequest).catch((e) => {
            console.warn(e);
        });
    }
}
