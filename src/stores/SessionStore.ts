import axios, { CancelTokenSource } from 'axios';
import {
    AccountInfo,
    AuthenticationResult,
    InteractionRequiredAuthError,
    PublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable, reaction, runInAction } from 'mobx';
import { API, loginRequest } from '../authConfig';
import { RootStore } from './stores';
import api, { isLive } from '../api/base';

export class SessionStore {
    // private readonly root: RootStore;
    @observable.ref
    account?: AccountInfo;

    @observable
    isLoggedIn: boolean = false;
    
    @observable.ref
    _msalInstance?: PublicClientApplication;

    cancelToken: CancelTokenSource = axios.CancelToken.source();

    constructor() {
        makeObservable(this);
    }

    @computed
    get msalInstance(): PublicClientApplication {
        if (!this._msalInstance) {
            throw 'No MSAL Instance set!';
        }
        return this._msalInstance;
    }

    @action
    setMsalInstance(msalInstance: PublicClientApplication) {
        this._msalInstance = msalInstance;
    }

    @action
    setAccount(account?: AccountInfo) {
        this.account = account;
    }

    @computed
    get loggedIn(): boolean {
        return !!this.account;
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
        const logoutRequest = {
            account: this.msalInstance.getAccountByUsername(this.account.username),
        };
        this.msalInstance.logoutRedirect(logoutRequest).catch((e) => {
            console.warn(e);
        });
    }

    @action
    getTokenRedirect(): Promise<void | AuthenticationResult> {
        if (!this.account) {
            throw 'No Login Present!';
        }
        const request = {
            scopes: [`${API}/api/access_as_user`],
            account: this.msalInstance.getAccountByUsername(this.account.username),
        };
        return this.msalInstance.acquireTokenSilent(request).catch((error) => {
            console.error(error);
            console.warn('silent token acquisition fails. acquiring token using popup');
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return this.msalInstance.acquireTokenRedirect(request);
            }
            throw error;
        });
    }
}
