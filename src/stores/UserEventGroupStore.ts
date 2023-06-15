import { action, computed, makeObservable, observable, override } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import {UserEventGroupCreate, UserEventGroup as UserEventGroupProps, create as apiCreate} from '../api/user_event_group';
import UserEventGroup from '../models/UserEventGroup';

export class UserEventGroupStore extends iStore<UserEventGroupProps> {
    readonly API_ENDPOINT = 'user_event_group';
    readonly root: RootStore;

    models = observable<UserEventGroup>([]);
    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
    }

    createModel(data: UserEventGroupProps): UserEventGroup {
        return new UserEventGroup(data, this);
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    get eventStore() {
        return this.root.eventStore;
    }

    get userStore() {
        return this.root.userStore;
    }

    @override
    create(model: UserEventGroupCreate) {
        /**
         * Save the model to the api
         */
        const eventIds = new Set(model.event_ids);
        return this.withAbortController('create', (sig) => {
            return apiCreate(model, sig.signal);
        }).then(action(({ data }) => {
            const model = this.addToStore(data, 'create');
            this.eventStore.events.filter(event => eventIds.has(event.id)).forEach((e) => {
                this.eventStore.addToStore({...e.props, userGroupId: model.id});
            });
            this.eventStore.addToStore
            return model;
        }));
    }

}
