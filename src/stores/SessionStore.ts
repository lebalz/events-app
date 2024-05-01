import {
    AccountInfo,
    IPublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { RootStore } from './stores';
import { Role, User } from '../api/user';
import Storage from './utils/Storage';
import Cookies from 'js-cookie';

class State {    
    @observable.ref
    account?: AccountInfo | null = undefined;

    @observable.ref
    _msalInstance?: IPublicClientApplication;

    constructor() {
        makeObservable(this);
    }
}

type PersistedData = {
    user?: User;
};


export class SessionStore {
    private readonly root: RootStore;
    private static readonly NAME = 'SessionStore' as const;
    @observable.ref
    private state: State = new State();

    @observable
    authMethod: 'apiKey' | 'msal';

    @observable
    currentUserId?: string;

    @observable
    initialized = false;
    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
        // attempt to load the previous state of this store from localstorage
        const data: PersistedData = Storage.get(SessionStore.NAME) || {};
        console.log('init', Cookies.get())

        this.rehydrate(data);

        reaction(
            () => this.root?.userStore?.current?.id,
            (userId) => {
                if (userId) {
                    const user = this.root.userStore.current;
                    Storage.set(SessionStore.NAME, {user: {...user.props, role: Role.USER}});
                }
            }
        )
    
        // listen to the localstorage value changing in other tabs to react to
        // signin/signout events in other tabs and follow suite.
        window.addEventListener('storage', (event) => {
            if (event.key === SessionStore.NAME && event.newValue) {
                const newData: PersistedData | null = JSON.parse(event.newValue);
        
                // data may be null if key is deleted in localStorage
                if (!newData) {
                    return;
                }
        
                // If we're not signed in then hydrate from the received data, otherwise if
                // we are signed in and the received data contains no user then sign out
                if (this.isLoggedIn) {
                    if (newData.user === null) {
                        void this.logout();
                    }
                } else {
                    this.rehydrate(newData);
                }
            }
        });
        this.initialized = true;
    }

    @action
    logout() {
        this.root.cleanup();
    }

    @action
    setMsalStrategy() {
        Storage.remove(SessionStore.NAME);
        this.authMethod = 'msal';
    }


    @action
    rehydrate(data: PersistedData) {
        this.authMethod = !!data?.user ? 'apiKey' : 'msal';
        if (!data?.user) {
            return
        }
        if (data.user) {
            this.root.userStore.addToStore(data.user);
        }
        this.currentUserId = data.user?.id;
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
    get isLoggedIn(): boolean {
        return this.authMethod === 'apiKey'
            ? !!this.currentUserId
            : !!this.state.account;
    }
}
