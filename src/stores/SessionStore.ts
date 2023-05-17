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
    account?: AccountInfo;

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
    get account(): AccountInfo | undefined {
        return this.state.account;
    }

    @action
    setMsalInstance(msalInstance: PublicClientApplication) {
        this.state._msalInstance = msalInstance;
    }

    @action
    setAccount(account?: AccountInfo) {
        if (account) {
            this.state.account = account;
            // if ((account.idTokenClaims?.exp || 0) > Date.now() / 1000) {
            // }
        }
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
