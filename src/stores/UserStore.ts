import { override, action, computed, makeObservable, observable, reaction } from 'mobx';
import {User as UserProps, linkToUntis, createIcs, Role, setRole, affectedEventIds as apiAffectedEventIds } from '../api/user';
import { RootStore } from './stores';
import User from '../models/User';
import _ from 'lodash';
import iStore from './iStore';
import Semester from '../models/Semester';
import UserEventGroup from '../models/UserEventGroup';

type ApiAction = 'linkUserToUntis' | 'createIcs';

export class UserStore extends iStore<UserProps, ApiAction> {
    readonly API_ENDPOINT = 'user';
    readonly root: RootStore;
    models = observable<User>([]);

    @observable.ref
    affectedEventIds = observable.set<string>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
        reaction(
            () => this.current,
            (user) => {
                if (user) {                
                    this.loadAffectedEventIds(user);
                }
            }
        )
    }


    createModel(data: UserProps): User {
        return new User(data, this, this.root.untisStore);
    }

    findUserGroup(id: string): UserEventGroup | undefined {
        return this.root.userEventGroupStore.find(id);
    }

    @computed
    get current(): User | undefined {
        return this.models.find((u) => u.email.toLowerCase() === this.root.sessionStore.account?.username?.toLowerCase());
    }
    
    @computed
    get currentUsersEvents() {
        return this.root.eventStore.byUser(this.current?.id);;
    }

    usersEvents(user: User) {
        return this.root.eventStore.byUser(user.id);
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    linkUserToUntis(user: User, untisId: number) {
        return this.withAbortController('linkUserToUntis', (sig) => {
            return linkToUntis(user.id, untisId, sig.signal).then(({data}) => {
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
            return setRole(user.id, role, sig.signal).then(({data}) => {
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
        const {current} = this;
        if (!current) {
            return Promise.reject('No current user');
        }
        return this.withAbortController('createIcs', (sig) => {
            return createIcs(current.id, sig.signal).then(({data}) => {
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
    loadAffectedEventIds(user: User, semester?: Semester) {
        return this.withAbortController(`load-affected-events-${user.id}-${semester?.id}`, (sig) => {
            return apiAffectedEventIds(user.id, semester?.id, sig.signal).then(action(({data}) => {
                this.affectedEventIds.replace([...this.getAffectedEventIds, ...data]);            
                return data;
            }));
        });
    }
}
