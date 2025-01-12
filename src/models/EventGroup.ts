import { action, computed, makeObservable, observable, override } from 'mobx';
import {
    DEFAULT_COLLECTION,
    DestroyEventAction,
    EventGroup as EventGroupProps,
    Meta
} from '../api/event_group';
import { ApiAction } from '../stores/iStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import { EventGroupStore } from '../stores/EventGroupStore';
import Event from './Event';
import User from './User';
import _ from 'lodash';

export default class EventGroup extends ApiModel<EventGroupProps, ApiAction | `clone-${string}`> {
    readonly UPDATEABLE_PROPS: UpdateableProps<EventGroupProps>[] = ['name', 'description', 'collection'];
    readonly _pristine: EventGroupProps;
    readonly isUserModel = true;
    readonly store: EventGroupStore;
    readonly id: string;
    readonly createdAt: Date;
    readonly meta: Meta;
    _loadingTriggered = false;

    userIds = observable.set<string>([]);
    eventIds = observable.set<string>([]);

    @observable accessor name: string;

    @observable accessor description: string;

    @observable accessor collection: string;

    @observable.ref accessor updatedAt: Date;

    constructor(props: EventGroupProps, store: EventGroupStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.meta = props.meta;
        this.collection = props.collection;
        this.userIds.replace(props.userIds);
        this.eventIds.replace(props.eventIds);
        this.name = props.name;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    @computed
    get events() {
        return this.store.eventStore.models.filter((event) => this.eventIds.has(event.id));
    }

    @computed
    get users() {
        return this.store.userStore.models.filter((user) => this.userIds.has(user.id));
    }

    @computed
    get eventCount() {
        return this.eventIds.size;
    }

    @computed
    get isFullyLoaded() {
        return this.eventCount === this.events.length;
    }

    @action
    loadEvents() {
        if (this._loadingTriggered) {
            return;
        }
        this._loadingTriggered = true;
        const missingIds = [
            ...this.eventIds,
            ...Object.values(this.meta)
                .map((k) => k.from)
                .filter((k) => !!k)
        ].filter((id) => !this.store.eventStore.find(id));
        return this.store.eventStore.loadEvents(missingIds, this.id);
    }

    get apiState() {
        return this.store.eventStore.apiStateFor(`load-events-${this.id}`);
    }

    get isEditable() {
        return true;
    }

    @computed
    get relatedModels() {
        return this.events
            .filter((e) => e.clonedFrom)
            .map((e) => {
                return {
                    a: e,
                    b: e.clonedFrom!
                };
            });
    }

    @action
    setCollection(name: string) {
        this.collection = name === DEFAULT_COLLECTION ? '' : name;
        this.save();
    }

    @action
    addEvents(events: Event[]) {
        events.forEach((event) => this.eventIds.add(event.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @action
    saveAll() {
        this.events.filter((e) => e.isDirty).forEach((event) => event.save());
    }

    @action
    discardAll() {
        this.events.filter((e) => e.isDirty).forEach((event) => event.reset());
    }

    @action
    removeEvents(events: Event[]) {
        events.forEach((event) => this.eventIds.delete(event.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @action
    addUsers(users: User[]) {
        users.forEach((user) => this.userIds.add(user.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @action
    removeUsers(users: User[]) {
        users.forEach((user) => this.userIds.delete(user.id));
        if (this.isDirty) {
            this.save();
        }
    }

    get props(): EventGroupProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            collection: this.collection,
            meta: this.meta,
            userIds: [...this.userIds].sort(),
            eventIds: [...this.eventIds].sort(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }

    @action
    appendUserId(id: string) {
        this._pristine.userIds.push(id);
        this.userIds.add(id);
    }
    @action
    appendEventId(id: string) {
        this._pristine.eventIds.push(id);
        this.eventIds.add(id);
        this.loadEvents();
    }
    @action
    rmUserId(id: string) {
        const idx = this._pristine.userIds.findIndex((v) => v === id);
        if (idx >= 0) {
            this._pristine.userIds.splice(idx, 1);
        }
        this.userIds.delete(id);
    }
    @action
    rmEventId(id: string) {
        const idx = this._pristine.eventIds.findIndex((v) => v === id);
        if (idx >= 0) {
            this._pristine.eventIds.splice(idx, 1);
        }
        this.eventIds.delete(id);
    }

    @action
    clone() {
        this.store.clone(this);
    }

    @computed
    get queryParam() {
        return `id=${this.id}`;
    }

    @computed
    get shareUrl() {
        return `/group?${this.queryParam}`;
    }

    @action
    destroy(action: DestroyEventAction = DestroyEventAction.Unlink) {
        return this.store.destroy(this, action);
    }

    /**
     * reloads the model only after 1 second of "silence" (=no triggers during this period)
     * or after 2.5s of permanent triggering...
     */
    triggerReload = _.debounce(action(this._triggerReload), 500, {
        leading: false,
        trailing: true,
        maxWait: 2500
    });

    @action
    _triggerReload() {
        return this.store.loadModel(this.id);
    }
}
