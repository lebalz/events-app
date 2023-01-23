import axios, { CancelTokenSource } from 'axios';
import {
    AccountInfo,
    AuthenticationResult,
    InteractionRequiredAuthError,
    PublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import { loginRequest } from '../authConfig';
import { RootStore } from './stores';
import api, { isLive } from '../api/base';

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
    isLoggedIn: boolean = false;

    cancelToken: CancelTokenSource = axios.CancelToken.source();


    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
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
        this.state.account = account;
        this.root.stores.forEach((store) => {
            store.load();
        });
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
        this.root.stores.forEach((store) => {
            store.reset();
        });
        const logoutRequest = {
            account: this.msalInstance.getAccountByUsername(this.state.account.username),
        };
        this.msalInstance.logoutRedirect(logoutRequest).catch((e) => {
            console.warn(e);
        }).then(() => {
            this.state = new State();
        });
    }
}
