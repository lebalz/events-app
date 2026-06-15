import { action, computed, observable, reaction } from 'mobx';
import { RootStore } from './stores';
import { logout } from '../api/user';
import Storage from './utils/Storage';

export class SessionStore {
    private readonly root: RootStore;
    private static readonly NAME = 'SessionStore' as const;
    @observable accessor initialized = false;

    @observable accessor isLoggedIn = false;
    @observable accessor currentUserId: string | undefined;

    constructor(store: RootStore) {
        this.root = store;
        // listen to the localstorage value changing in other tabs to react to
        // signin/signout events in other tabs and follow suite.
        this.initialized = true;
    }
    @action
    setCurrentUserId(userId: string | undefined) {
        this.currentUserId = userId;
        if (userId) {
            this.setIsLoggedIn(true);
        } else {
            this.setIsLoggedIn(false);
        }
    }

    @computed
    get isStudent() {
        return this.root.userStore.current?.isStudent;
    }

    @action
    setIsLoggedIn(loggedIn: boolean) {
        this.isLoggedIn = loggedIn;
    }

    @action
    logout() {
        const sig = new AbortController();
        logout(sig.signal)
            .then(() => {
                this.root.cleanup();
                Storage.remove(SessionStore.NAME);
                localStorage.clear();
                window.location.reload();
            })
            .catch((err) => {
                console.error('Failed to logout', err);
            });
    }

    get locale() {
        return this.root.currentLocale;
    }
}
