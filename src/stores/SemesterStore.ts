import { action, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import {semesters as fetchSemesters} from '../api/semester';
import Semester from '../models/Semester';

export class SemesterStore implements iStore<Semester> {
    private readonly root: RootStore;
    semesters = observable<Semester>([]);
    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    findSemester = computedFn(
        function (this: SemesterStore, id?: string): Semester | undefined {
            if (!id) {
                return;
            }
            return this.semesters.find((d) => d.id === id);
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
                    console.log('semester', data)
                    if (data) {
                        this.semesters.replace(data.map((d) => new Semester(d, this)));
                    }
                    return this.semesters;
                })
            )
    }

    @action
    reset() {
        this.semesters.clear();
    }
    @action
    save(model) {
        throw new Error('Not implemented');
    }
}
