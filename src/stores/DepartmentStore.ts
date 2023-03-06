import { action, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import axios from 'axios';
import { RootStore } from './stores';
import iStore from './iStore';
import { computedFn } from 'mobx-utils';
import {departments as fetchDepartments} from '../api/department';
import Department from '../models/Department';

export class DepartmentStore implements iStore<Department[]> {
    private readonly root: RootStore;
    departments = observable<Department>([]);
    cancelToken = axios.CancelToken.source();
    constructor(root: RootStore) {
        this.root = root;
        makeObservable(this);
    }

    findDepartment = computedFn(
        function (this: DepartmentStore, id?: string): Department | undefined {
            if (!id) {
                return;
            }
            return this.departments.find((d) => d.id === id);
        },
        { keepAlive: true }
    )

    getEvents(department: Department) {
        return this.root.eventStore.events.filter((e) => e.departmentIds.includes(department.id));
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    load() {
        return fetchDepartments(this.cancelToken)
            .then(
                action(({ data }) => {
                    console.log('departments', data)
                    if (data) {
                        this.departments.replace(data.map((d) => new Department(d, this)));
                    }
                    return this.departments;
                })
            )
    }

    @action
    reset() {
        this.departments.clear();
    }
}
