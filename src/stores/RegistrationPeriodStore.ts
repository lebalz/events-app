import { action, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import {semesters as fetchSemesters} from '../api/semester';
import Semester from '../models/Semester';
import RegistrationPeriod from '../models/RegistrationPeriod';

export class RegistrationPeriodStore implements iStore<RegistrationPeriod[]> {
    private readonly root: RootStore;
    periods = observable<RegistrationPeriod>([]);
    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    findSemester = computedFn(
        function (this: RegistrationPeriodStore, id?: string): RegistrationPeriod | undefined {
            if (!id) {
                return;
            }
            return this.periods.find((d) => d.id === id);
        },
        { keepAlive: true }
    )

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        return fetchSemesters(this.cancelToken)
            .then(
                action(({ data }) => {
                    console.log('registration period', data)
                    if (data) {
                        this.periods.replace(data.map((d) => new RegistrationPeriod(d, this)));
                    }
                    return this.periods;
                })
            )
    }

    @action
    reset() {
        this.periods.clear();
    }
}
