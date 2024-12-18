import { action, computed, observable } from 'mobx';
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

    @action
    ignoreEvent(eventId: string) {
        this.ignoreEvents([eventId]);
    }

    @action
    ignoreEvents(eventIds: string[]) {
        eventIds.forEach((id) => this.ignoredEventIds.add(id));
        this.save();
    }

    @action
    unignoreEvent(eventId: string) {
        this.unignoreEvents([eventId]);
    }

    @action
    unignoreEvents(eventIds: string[]) {
        eventIds.forEach((id) => this.ignoredEventIds.delete(id));
        this.save();
    }

    @action
    setSubscribeToAffected(subscribe: boolean) {
        this.subscribeToAffected = subscribe;
        this.save();
    }

    @computed
    get ignoredEvents() {
        return this.store.root.eventStore?.events.filter((event) => this.ignoredEventIds.has(event.id));
    }

    @computed
    get semestersIgnoredEvents() {
        return this.store.root.viewStore.semester.events.filter((e) => this.ignoredEventIds.has(e.id));
    }

    @action
    addDepartment(departmentId: string) {
        this.departmentIds.add(departmentId);
        this.save();
    }

    @action
    removeDepartment(departmentId: string) {
        this.departmentIds.delete(departmentId);
        this.save();
    }

    @computed
    get departments() {
        return this.store.root.departmentStore.departments.filter((department) =>
            this.departmentIds.has(department.id)
        );
    }

    @action
    addUntisClass(untisClassId: number) {
        this.untisClassIds.add(untisClassId);
        this.save();
    }

    @action
    removeUntisClass(untisClassId: number) {
        this.untisClassIds.delete(untisClassId);
        this.save();
    }

    @computed
    get untisClasses() {
        return this.store.root.untisStore.classes.filter((untisClass) =>
            this.untisClassIds.has(untisClass.id)
        );
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
