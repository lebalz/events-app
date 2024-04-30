import { action, computed, makeObservable, observable } from 'mobx';
import { RootStore } from './stores';
import { User } from '../api/user';
import {default as UserModel} from '../models/User';
import { getCookie } from 'tiny-cookie';
import Storage from './utils/Storage';

type PersistedData = {
    user?: User;
};

const AUTH_STORE = 'AUTH_STORE' as const;

export class SessionStore {
    private readonly root: RootStore;
    /* The ID of the user that is currently signed in. */
    @observable
    currentUserId?: string | null;

    /* The authentication provider the user signed in with. */
    @observable
    lastSignedIn?: string | null;

    /* The email address to contact if the user is suspended. */
    @observable
    suspendedContactEmail?: string | null;

    @observable
    initialized = false;
    constructor(store: RootStore) {
        this.root = store;
        makeObservable(this);
        // attempt to load the previous state of this store from localstorage
        const data: PersistedData = Storage.get(AUTH_STORE) || {};

        this.rehydrate(data);
    }


    @action
    rehydrate(data: PersistedData) {
        if (data.user) {
            this.root.userStore.addToStore(data.user);
        }

        this.currentUserId = data.user?.id;
        this.lastSignedIn = getCookie('lastSignedIn');
    }


    /** The current user */
    @computed
    get user() {
        return this.currentUserId
            ? this.root.userStore.find<UserModel>(this.currentUserId)
            : undefined;
    }

    @computed
    get isStudent(): boolean {
        return this.user?.email.includes('@edu.') ?? false;
    }

    @computed
    get isLoggedIn(): boolean {
        return !!this.user;
    }

    @computed
    get props() {
        return {
            user: this.user.props
        }
    }

    @action
    fetchConfig = async () => {
        const res = await client.post("/auth.config");
        this.config = res.data;
    };
}
