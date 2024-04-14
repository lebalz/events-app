import { computed, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import { RegistrationPeriod as RegPeriodProps } from '../api/registration_period';
import RegistrationPeriod from '../models/RegistrationPeriod';
import { EndPoint } from './EndPoint';

export class RegistrationPeriodStore extends iStore<RegPeriodProps> {
    readonly ApiEndpoint = new EndPoint('registration_periods', { authorized: true});
    readonly root: RootStore;

    models = observable<RegistrationPeriod>([]);
    constructor(root: RootStore) {
        super();
        this.root = root;
        makeObservable(this);
    }

    createModel(data: RegPeriodProps): RegistrationPeriod {
        return new RegistrationPeriod(data, this);
    }

    @computed
    get registrationPeriods() {
        return _.sortBy(this.models, ['_pristine.start', '_pristine.eventRangeStart'], ['desc', 'desc']);
    }
}
