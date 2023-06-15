import { computed, makeObservable, observable, override } from "mobx";
import { UserEventGroup as UserEventGroupProps } from "../api/user_event_group";
import { ApiAction } from "../stores/iStore";
import ApiModel, { UpdateableProps } from "./ApiModel";
import { UserEventGroupStore } from "../stores/UserEventGroupStore";

export default class UserEventGroup extends ApiModel<UserEventGroupProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<UserEventGroupProps>[] = [
        "name",
        'description'
    ];
    readonly _pristine: UserEventGroupProps;
    readonly store: UserEventGroupStore;
    readonly id: string;
    readonly createdAt: Date;
    readonly userId: string;
    
    @observable
    name: string;

    @observable
    description: string;

    @observable.ref
    updatedAt: Date;

    constructor(props: UserEventGroupProps, store: UserEventGroupStore) {
        super();
        this.store = store;
        this._pristine = props;
        this.id = props.id;
        this.userId = props.userId;
        this.name = props.name;
        this.description = props.description;
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);

        makeObservable(this);
    }

    @computed
    get events() {
        return this.store.eventStore.models.filter(event => event.userGroupId === this.id);
    }

    @override
    get props(): UserEventGroupProps {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            userId: this.props.userId,
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString(),
        };
    }
}