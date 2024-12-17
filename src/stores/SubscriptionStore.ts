import { action, observable } from 'mobx';
import { Subscription as SubscriptionProps } from '../api/subscription';

import { RootStore } from './stores';
import _ from 'lodash';
import iStore from './iStore';
import { EndPoint } from './EndPoint';
import Subscription from '../models/Subscription';

type ApiAction = `update-subscription-${string}`;

export class SubscriptionStore extends iStore<SubscriptionProps, ApiAction> {
    @observable.ref accessor ApiEndpoint = new EndPoint('subscriptions', { authorized: true });

    readonly root: RootStore;
    models = observable<Subscription>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
    }

    createModel(data: SubscriptionProps): Subscription {
        return new Subscription(data, this);
    }

    @action
    destroy(model: Subscription) {
        throw new Error('Not implemented');
    }
}
