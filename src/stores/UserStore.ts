import { override, action, computed, makeObservable, observable, reaction } from 'mobx';
import {
    User as UserProps,
    linkToUntis,
    createIcs,
    Role,
    setRole,
    affectedEventIds as apiAffectedEventIds
} from '../api/user';
import { RootStore } from './stores';
import User from '../models/User';
import _ from 'lodash';
import iStore from './iStore';
import EventGroup from '../models/EventGroup';
import { EndPoint } from './EndPoint';
import Storage, { PersistedData, StorageKey } from './utils/Storage';

type ApiAction = 'linkUserToUntis' | 'createIcs';

export class UserStore extends iStore<UserProps, ApiAction> {
    readonly ApiEndpoint = new EndPoint('users', { authorized: true });

    readonly root: RootStore;
    models = observable<User>([]);

    @observable.ref
    affectedEventIds = observable.set<string>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;

        setTimeout(() => {
            // attempt to load the previous state of this store from localstorage
            this.rehydrate();
        }, 1);
    }

    @action
    rehydrate(_data?: PersistedData) {
        if (this.models.length > 0) {
            return;
        }
        const data = _data || Storage.get(StorageKey.SessionStore) || {};
        if (data.user) {
            try {
                this.addToStore(data.user);
            } catch (e) {
                console.error(e);
                Storage.remove(StorageKey.SessionStore);
            }
        }
    }

    createModel(data: UserProps): User {
        return new User(data, this, this.root.untisStore);
    }

    findUserGroup(id: string): EventGroup | undefined {
        return this.root.eventGroupStore.find(id);
    }

    @computed
    get current(): User | undefined {
        if (this.root.sessionStore?.authMethod === 'msal') {
            return this.models.find(
                (u) => u.email.toLowerCase() === this.root.sessionStore?.account?.username?.toLowerCase()
            );
        }
        return this.models.find((u) => u.id === this.root.sessionStore?.currentUserId);
    }

    @computed
    get currentUsersEvents() {
        return this.root.eventStore.byUser(this.current?.id);
    }

    @override
    postLoad(models: User[], publicModels: boolean, success?: boolean): Promise<any> {
        if (!publicModels && success && this.current) {
            return this.loadAffectedEventIds(this.current, this.root.semesterStore?.currentSemester?.id);
        }
        return Promise.resolve();
    }

    usersEvents(user: User) {
        return this.root.eventStore.byUser(user.id);
    }

    @action
    linkUserToUntis(user: User, untisId: number) {
        return this.withAbortController('linkUserToUntis', (sig) => {
            return linkToUntis(user.id, untisId, sig.signal).then(({ data }) => {
                user.setUntisId(data.untisId);
            });
        });
    }

    @action
    setRole(user: User, role: Role) {
        if (!this.current?.isAdmin) {
            return Promise.reject('Not allowed');
        }
        return this.withAbortController(`save-role-${user.id}`, (sig) => {
            return setRole(user.id, role, sig.signal).then(({ data }) => {
                this.addToStore(data);
            });
        });
    }

    @action
    loadUser(id: string) {
        return this.loadModel(id);
    }

    @action
    createIcs() {
        const { current } = this;
        if (!current) {
            return Promise.reject('No current user');
        }
        return this.withAbortController('createIcs', (sig) => {
            return createIcs(current.id, sig.signal).then(({ data }) => {
                if (this.current?.id === current.id) {
                    this.addToStore(data);
                }
            });
        });
    }

    @computed
    get getAffectedEventIds() {
        if (!this.current) {
            return new Set([]);
        }
        return this.affectedEventIds;
    }

    @action
    loadAffectedEventIds(user?: User, semesterId?: string) {
        if (!user) {
            return Promise.resolve([]);
        }
        return this.withAbortController(`load-affected-events-${user.id}-${semesterId}`, (sig) => {
            return apiAffectedEventIds(user.id, semesterId, sig.signal).then(
                action(({ data }) => {
                    this.affectedEventIds.replace([...this.getAffectedEventIds, ...data]);
                    return data;
                })
            );
        });
    }
}
