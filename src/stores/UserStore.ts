import { action, computed, makeObservable, observable } from 'mobx';
import { computedFn } from 'mobx-utils';
import { users as fetchUsers } from '../api/user';
import { RootStore } from './stores';
import User from '../models/User';
import _ from 'lodash';
import axios from 'axios';
import Teacher from '../models/Untis/Teacher';
import iStore from './iStore';

export class UserStore implements iStore<User[]> {
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

    findUntisUser(untisId: number): Teacher | undefined {
        return this.root.untisStore.findTeacher(untisId) as Teacher | undefined;
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


    @action
    reload() {
        this.users.replace([]);
        if (this.root.sessionStore.account) {
            this.cancelToken.cancel();
            this.cancelToken = axios.CancelToken.source();
            fetchUsers(this.cancelToken)
                .then(
                    action(({ data }) => {
                        const users = data.map((u) => new User(u, this));
                        this.users.replace(users);
                        this.initialized = true;
                    })
                )
        }
    }

    
    @action
    load() {
        return fetchUsers(this.cancelToken)
            .then(
                action(({ data }) => {
                    const users = data.map((u) => new User(u, this));
                    this.users.replace(users);
                    this.initialized = true;
                    return this.users;
                })
            )
    }

    @action
    reset() {
        this.cancelRequest()
        this.users.replace([]);
    }
}
