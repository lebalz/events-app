import { action, computed, makeObservable, observable, override } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore, { ApiAction } from './iStore';
import { Event as EventProps } from '../api/event';
import {
    EventGroupCreate,
    EventGroup as EventGroupProps,
    create as apiCreate,
    clone as apiClone,
    events as fetchEvents,
    DestroyEventAction,
    DEFAULT_COLLECTION
} from '../api/event_group';
import EventGroup from '../models/EventGroup';
import ApiModel from '../models/ApiModel';
import { EndPoint } from './EndPoint';
import { destroy as apiDestroy } from '../api/api_model';
import { translate } from '@docusaurus/Translate';
import { computedFn } from 'mobx-utils';

export class EventGroupStore extends iStore<
    EventGroupProps,
    ApiAction | `clone-${string}` | `fetch-${string}`
> {
    @observable.ref accessor ApiEndpoint = new EndPoint('event_groups', { authorized: true });

    readonly root: RootStore;

    models = observable<EventGroup>([]);
    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    createModel(data: EventGroupProps): EventGroup {
        return new EventGroup(data, this);
    }

    get eventStore() {
        return this.root.eventStore;
    }

    get userStore() {
        return this.root.userStore;
    }

    @computed
    get eventGroups(): EventGroup[] {
        return _.orderBy(this.models, ['_pristine.name'], ['desc']) as EventGroup[];
    }

    byCollection = computedFn(function (this: EventGroupStore, name?: string): EventGroup[] {
        if (name === undefined) {
            return [];
        }
        return this.eventGroups.filter((eg) => eg.collection === name);
    });

    create(model: EventGroupCreate) {
        /**
         * Save the model to the api
         */
        return this.withAbortController('create', (sig) => {
            if (model.collection === DEFAULT_COLLECTION) {
                delete model.collection;
            }
            return apiCreate(model, sig.signal);
        }).then(
            action(({ data }) => {
                const model = this.addToStore(data, 'create') as EventGroup;
                if (
                    model._pristine.eventIds.length > 0 &&
                    model.events.length !== model._pristine.eventIds.length
                ) {
                    return this.reloadEvents(model).then(() => model);
                } else {
                    return model;
                }
            })
        );
    }

    @action
    clone(model: EventGroup) {
        /**
         * Clone the model to the api
         */
        if (!model) {
            return;
        }

        return this.withAbortController(`clone-${model.id}`, (sig) => {
            return apiClone(model.id, sig.signal);
        })
            .then(({ data }: { data: EventGroupProps }) => {
                const group = this.addToStore(data);
                return this.reloadEvents(group);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    @computed
    get collections() {
        return [...new Set(this.eventGroups.map((e) => e.collection))].sort();
    }

    @action
    reloadEvents(model: ApiModel<EventGroupProps, ApiAction>) {
        if (!model) {
            return;
        }
        return this.withAbortController(`fetch-${model.id}`, (sig) => {
            return fetchEvents(model.id, sig.signal);
        })
            .then(({ data }: { data: EventProps[] }) => {
                return data.map((e) => {
                    return this.eventStore.addToStore(e);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    byIds(ids?: string | string[]): EventGroup[] {
        if (!ids) {
            return [];
        }
        if (!Array.isArray(ids)) {
            ids = [ids];
        }
        return ids.map((id) => this.find<EventGroup>(id)).filter((e) => !!e);
    }

    @action
    destroy(model: EventGroup, eventAction: DestroyEventAction = DestroyEventAction.Unlink) {
        const { id } = model;
        this.withAbortController(`destroy-${id}`, (sig) => {
            return apiDestroy<EventGroup>(
                `${this.ApiEndpoint.Base}/${id}?eventAction=${eventAction}`,
                sig.signal
            );
        }).then(
            action(() => {
                this.removeFromStore(id);
            })
        );
    }
}
