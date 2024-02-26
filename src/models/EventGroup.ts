import { action, computed, makeObservable, observable, override } from "mobx";
import { EventGroup as EventGroupProps } from "../api/event_group";
import { ApiAction } from "../stores/iStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import { EventGroupStore } from "../stores/EventGroupStore";
import Event from "./Event";
import User from "./User";
import { toGlobalDate } from "./helpers/time";

export default class EventGroup extends ApiModel<EventGroupProps, ApiAction | `clone-${string}`> {
    readonly UPDATEABLE_PROPS: UpdateableProps<EventGroupProps>[] = [
        "name",
        'description'
    ];
    readonly _pristine: EventGroupProps;
    readonly isUserModel = true;
    readonly store: EventGroupStore;
    readonly id: string;
    readonly createdAt: Date;

    userIds = observable.set<string>([]);
    eventIds = observable.set<string>([]);
    
    @observable
    name: string;

    @observable
    description: string;

    @observable.ref
    updatedAt: Date;

    constructor(props: EventGroupProps, store: EventGroupStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.userIds.replace(props.userIds);
        this.eventIds.replace(props.eventIds);
        this.name = props.name;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @computed
    get events() {
        return this.store.eventStore.models.filter(event => this.eventIds.has(event.id));
    }

    @computed
    get users() {
        return this.store.userStore.models.filter(user => this.userIds.has(user.id));
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
        if (!this.isFullyLoaded) {
            const missingIds = [...this.eventIds].filter(id => !this.store.eventStore.find(id));
            return this.store.eventStore.loadEvents(missingIds, this.id);
        }
    }

    get apiState() {
        return this.store.eventStore.apiStateFor(`load-events-${this.id}`);
    }

    @override
    get isEditable() {
        return true;
    }

    @action
    addEvents(events: Event[]) {
        events.forEach(event => this.eventIds.add(event.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @action
    shiftEvents(shiftMs: number) {
        this.events.filter(e => e.isDraft).forEach(event => {
            const start = new Date(event.start.getTime() + shiftMs);
            const end = new Date(event.end.getTime() + shiftMs);
            event.update({ 
                start: toGlobalDate(start).toISOString(), 
                end: toGlobalDate(end).toISOString()
            });
        });
    }

    @action
    saveAll() {
        this.events.filter(e => e.isDirty).forEach(event => event.save());
    }

    @action
    discardAll() {
        this.events.filter(e => e.isDirty).forEach(event => event.reset());        
    }

    @action
    removeEvents(events: Event[]) {
        events.forEach(event => this.eventIds.delete(event.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @action
    addUsers(users: User[]) {
        users.forEach(user => this.userIds.add(user.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @action
    removeUsers(users: User[]) {
        users.forEach(user => this.userIds.delete(user.id));
        if (this.isDirty) {
            this.save();
        }
    }

    @override
    get props(): EventGroupProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            userIds: [...this.userIds].sort(),
            eventIds: [...this.eventIds].sort(),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
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
        const idx = this._pristine.userIds.findIndex(v => v === id);
        if (idx >= 0) {
            this._pristine.userIds.splice(idx, 1);
        }
        this.userIds.delete(id);
    }
    @action
    rmEventId(id: string) {
        const idx = this._pristine.eventIds.findIndex(v => v === id);
        if (idx >= 0) {
            this._pristine.eventIds.splice(idx, 1);
        }
        this.eventIds.delete(id);
    }

    @action
    clone() {
        this.store.clone(this);
    }
}