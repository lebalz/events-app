import axios, { CancelTokenSource } from 'axios';
import {
    AccountInfo,
    PublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable } from 'mobx';
import { loginRequest } from '../authConfig';
import { RootStore } from './stores';
import { setupAxios } from '../api/base';

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
    initialized = false;

    cancelToken: CancelTokenSource = axios.CancelToken.source();

    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
    }

    get locale() {
        return this.root.currentLocale;
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

    @computed
    get needsRefresh(): boolean {
        if (!this.account) {
            return false;
        }
        if (this.root.userStore.initialLoadPerformed) {
            return !!!this.root.userStore.current;
        }
        return false;
    }

    @action
    setMsalInstance(msalInstance: PublicClientApplication) {
        this.initialized = true;
        this.state._msalInstance = msalInstance;
    }

    @action
    setAccount(account?: AccountInfo | null, reconfig: boolean = false) {
        this.state.account = account;
        if (reconfig) {
            setupAxios(account);
            this.root.cleanup();
            this.root.load('authorized');
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
    refresh() {
        if (this.account && this.msalInstance)  {
            this.msalInstance.acquireTokenSilent({
                account: this.account,
                scopes: loginRequest.scopes,
            }).then((response) => {
                this.setAccount(response.account, true);
            }).catch((e) => {
                console.warn(e);
            });
        } else {
            this.login();
        }
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
