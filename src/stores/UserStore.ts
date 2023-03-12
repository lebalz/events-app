import { action, computed, makeObservable, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import {User as UserProps, linkToUntis } from '../api/user';
import { RootStore } from './stores';
import User from '../models/User';
import _ from 'lodash';
import axios from 'axios';
import iStore from './iStore';
import { createCancelToken } from '../api/base';

export class UserStore extends iStore<UserProps> {
    readonly API_ENDPOINT = 'user';
    readonly root: RootStore;
    @observable
    initialized = false;
    models = observable<User>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
    }

    createModel(data: UserProps): User {
        return new User(data, this, this.root.untisStore);
    }

    @computed
    get current(): User | undefined {
        return this.models.find((u) => u.email.toLowerCase() === this.root.sessionStore.account?.username.toLowerCase());
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
        const [ct] = createCancelToken();
        linkToUntis(user.id, untisId, ct).then(({data}) => {
            user.setUntisId(data.untisId);
        });
    }

    @action
    loadUser(id: string) {
        return this.loadModel(id);
    }
}
