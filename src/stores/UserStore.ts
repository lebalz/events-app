import { action, computed, makeObservable, observable, reaction } from 'mobx';
import {User as UserProps, linkToUntis, createIcs } from '../api/user';
import { RootStore } from './stores';
import User from '../models/User';
import _ from 'lodash';
import iStore from './iStore';

type ApiAction = 'linkUserToUntis' | 'createIcs';

export class UserStore extends iStore<UserProps, ApiAction> {
    readonly API_ENDPOINT = 'user';
    readonly root: RootStore;
    @observable
    initialized = false;
    models = observable<User>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
        reaction(
            () => this.current,
            (user) => {
                if (user?.untisId) {
                    this.root.untisStore.loadUntisTeacher(user.untisId);
                }
            }
        )
    }

    createModel(data: UserProps): User {
        return new User(data, this, this.root.untisStore);
    }

    @computed
    get current(): User | undefined {
        return this.models.find((u) => u.email.toLowerCase() === this.root.sessionStore.account?.username?.toLowerCase());
    }
    
    @computed
    get currentUsersEvents() {
        return this.root.eventStore.events.slice().filter((e) => e.authorId === this.current?.id);
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
}