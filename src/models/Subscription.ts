import { computed, observable } from 'mobx';
import { Subscription as SubscriptionProps } from '../api/subscription';
import { ApiAction } from '../stores/iStore';
import ApiModel, { UpdateableProps } from './ApiModel';
import { SubscriptionStore } from '../stores/SubscriptionStore';

export default class Subscription extends ApiModel<SubscriptionProps, ApiAction> {
    readonly UPDATEABLE_PROPS: UpdateableProps<SubscriptionProps>[] = [
        'subscribeToAffected',
        'departmentIds',
        'untisClassIds',
        'ignoredEventIds'
    ];
    readonly store: SubscriptionStore;
    readonly isUserModel = true;

    readonly _pristine: SubscriptionProps;

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly id: string;
    readonly userId: string;
    readonly icsLocator: string;

    @observable accessor subscribeToAffected: boolean = false;

    departmentIds = observable.set<string>([]);
    untisClassIds = observable.set<number>([]);
    ignoredEventIds = observable.set<string>([]);

    constructor(props: SubscriptionProps, store: SubscriptionStore) {
        super();
        this._pristine = props;
        this.store = store;

        this.id = props.id;
        this.userId = props.userId;
        this.icsLocator = props.icsLocator;
        this.subscribeToAffected = props.subscribeToAffected;
        this.departmentIds.replace(props.departmentIds);
        this.untisClassIds.replace(props.untisClassIds);
        this.ignoredEventIds.replace(props.ignoredEventIds);
        this.createdAt = new Date(props.createdAt);
        this.updatedAt = new Date(props.updatedAt);
    }

    get user() {
        return this.store.root.userStore.find(this.userId);
    }

    @computed
    get props(): SubscriptionProps {
        return {
            id: this.id,
            userId: this.userId,
            icsLocator: this.icsLocator,
            subscribeToAffected: this.subscribeToAffected,
            departmentIds: [...this.departmentIds],
            untisClassIds: [...this.untisClassIds],
            ignoredEventIds: [...this.ignoredEventIds],
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}
