import {
    AccountInfo,
    IPublicClientApplication,
} from '@azure/msal-browser';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { RootStore } from './stores';
import { Role, User, logout } from '../api/user';
import Storage, { PersistedData } from './utils/Storage';
import { UntisTeacher } from '../api/untis';
import siteConfig from '@generated/docusaurus.config';
const { NO_AUTH, TEST_USERNAME } = siteConfig.customFields as { TEST_USERNAME?: string, NO_AUTH?: boolean};

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
    private static readonly NAME = 'SessionStore' as const;
    @observable.ref
    private state: State = new State();

    @observable
    authMethod: 'apiKey' | 'msal';

    @observable
    currentUserId?: string;

    @observable
    initialized = false;

    @observable
    storageSyncInitialized = false;

    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
        // attempt to load the previous state of this store from localstorage
        const data = Storage.get(SessionStore.NAME) || {};

        this.rehydrate(data);

        reaction(
            () => this.root.userStore?.current?.shortName ?? this.root.userStore?.current?.email,
            (name) => {
                if (name) {
                    const user = this.root.userStore.current;
                    Storage.set(
                        SessionStore.NAME,
                        {
                            user: {...user.props, role: Role.USER}, 
                            teacher: {...user.untisTeacher?.props}
                        }
                    );
                }
            }
        )
    
        // listen to the localstorage value changing in other tabs to react to
        // signin/signout events in other tabs and follow suite.
        this.initialized = true;
    }

    @action
    rehydrate(data: PersistedData) {
        this.authMethod = !!data?.user ? 'apiKey' : 'msal';
        if (!data.user) {
            return
        }
        this.currentUserId = data.user?.id;
    }

    @action
    setupStorageSync() {
        if (this.storageSyncInitialized) {
            return;
        }
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
                    this.root.userStore.rehydrate(newData);
                    this.root.untisStore.rehydrate(newData);
                }
            }
        });
        this.storageSyncInitialized = true;
    }

    @action
    logout() {
        const sig = new AbortController();
        logout(sig.signal).then(() => {
            this.root.cleanup();
            Storage.remove(SessionStore.NAME);
            localStorage.clear();
            window.location.reload();
        }).catch((err) => {
            console.error('Failed to logout', err);
        });
    }

    @action
    setMsalStrategy() {
        Storage.remove(SessionStore.NAME);
        this.authMethod = 'msal';
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
