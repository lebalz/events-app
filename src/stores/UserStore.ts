import { action, computed, makeObservable, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { users as fetchUsers, find as findUser, linkToUntis } from '../api/user';
import { RootStore } from './stores';
import User from '../models/User';
import _ from 'lodash';
import axios from 'axios';
import iStore from './iStore';
import { createCancelToken } from '../api/base';

export class UserStore implements iStore<User> {
    private readonly root: RootStore;
    @observable
    initialized = false;
    users = observable<User>([]);

    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    cancelRequest() {
        this.cancelToken.cancel();
        this.cancelToken = axios.CancelToken.source();
    }


    @computed
    get current(): User | undefined {
        return this.users.find((u) => u.email.toLowerCase() === this.root.sessionStore.account?.username.toLowerCase());
    }

    find = computedFn(
        function (this: UserStore, id?: string): User | undefined {
            if (!id) {
                return;
            }
            return this.users.find((user) => user.id === id);
        },
        { keepAlive: true }
    );
    
    @computed
    get currentUsersEvents() {
        return this.root.eventStore.events.slice().filter((e) => e.authorId === this.current?.id);
    }

    @action
    reload() {
        this.users.replace([]);
        if (this.root.sessionStore.account) {
            this.cancelToken.cancel();
            this.cancelToken = axios.CancelToken.source();
            fetchUsers(this.cancelToken)
                .then(
                    action(({ data }) => {
                        const users = data.map((u) => new User(u, this, this.root.untisStore));
                        this.users.replace(users);
                        this.initialized = true;
                    })
                )
        }
    }

    
    @action
    load() {
        const [ct] = createCancelToken();
        return fetchUsers(ct)
            .then(
                action(({ data }) => {
                    if (!data) {
                        return;
                    }
                    const users = data.map((u) => new User(u, this, this.root.untisStore));
                    this.users.replace(users);
                    this.initialized = true;
                    return this.users;
                })
            )
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
        const [ct] = createCancelToken();
        return findUser(id, ct).then(action(({ data }) => {
            const user = new User(data, this, this.root.untisStore);
            const users = this.users.slice();
            const idx = users.findIndex((e) => e.id === user.id);
            if (idx !== -1) {
                users.splice(idx, 1);
            }
            this.users.replace([...users, user]);
            return user;
        }))
    }

    @action
    reset() {
        this.cancelRequest()
        this.users.replace([]);
    }
}
