import { action, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import {RegistrationPeriod as RegPeriodProps} from '../api/registration_period';
import RegistrationPeriod from '../models/RegistrationPeriod';

export class RegistrationPeriodStore extends iStore<RegPeriodProps> {
    readonly API_ENDPOINT = 'registration_period';
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

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

}
