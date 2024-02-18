import { action, computed, makeObservable, observable, override } from "mobx";
import { EventGroup as EventGroupProps } from "../api/event_group";
import { ApiAction } from "../stores/iStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import { EventGroupStore } from "../stores/EventGroupStore";

export default class UserEventGroup extends ApiModel<EventGroupProps, ApiAction | `clone-${string}`> {
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
        this.userIds.replace(props.users.map(u => u.id));
        this.eventIds.replace(props.events.map(e => e.id));
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

    @override
    get isEditable() {
        return true;
    }

    @override
    get props(): EventGroupProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            users: [...this.userIds].map(id => ({ id })),
            events: [...this.eventIds].map(id => ({ id })),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }

    @action
    clone() {
        this.store.clone(this);
    }
}