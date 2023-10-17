import { action, makeObservable, observable, override } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore, { ApiAction } from './iStore';
import { Event as EventProps } from '../api/event';
import {UserEventGroupCreate, UserEventGroup as UserEventGroupProps, create as apiCreate, clone as apiClone, events as fetchEvents} from '../api/user_event_group';
import UserEventGroup from '../models/UserEventGroup';
import ApiModel from '../models/ApiModel';

export class UserEventGroupStore extends iStore<UserEventGroupProps, ApiAction | `clone-${string}` | `fetch-${string}`> {
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

    get userEventGroups(): UserEventGroup[] {
        return this.models as UserEventGroup[];
    }

    @override
    create(model: UserEventGroupCreate) {
        /**
         * Save the model to the api
         */
        return this.withAbortController('create', (sig) => {
            return apiCreate(model, sig.signal);
        }).then(action(({ data }) => {
            const cloned = this.addToStore(data, 'create');
            return this.reloadEvents(cloned).then(() => cloned);
        }));
    }

    @action
    clone(model: UserEventGroup) {
        /**
         * Clone the model to the api
         */
        if (!model) {
            return;
        } 

        return this.withAbortController(`clone-${model.id}`, (sig) => {
            return apiClone(model.id, sig.signal);
        }).then(({ data }: { data: UserEventGroupProps }) => {
            const group = this.addToStore(data);
            return this.reloadEvents(group);
        }).catch((err) => {
            console.log(err);
        });
    }

    @action
    reloadEvents(model: ApiModel<UserEventGroupProps, ApiAction>) {
        if (!model) {
            return;
        } 
        return this.withAbortController(`fetch-${model.id}`, (sig) => {
            return fetchEvents(model.id, sig.signal);
        }).then(({ data }: { data: EventProps[]}) => {
            return data.map((e) => {
                return this.eventStore.addToStore(e);
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}
