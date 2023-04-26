import { action, computed, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import {Department as DepartmentProps} from '../api/department';
import Department from '../models/Department';

export class DepartmentStore extends iStore<DepartmentProps> {
    readonly root: RootStore;
    readonly API_ENDPOINT = 'department';
    models = observable<Department>([]);
    
    constructor(root: RootStore) {
        super()
        this.root = root;
        makeObservable(this);
    }

    @computed
    get departments() {
        return this.models;
    }

    createModel(data: DepartmentProps): Department {
        return new Department(data, this);        
    }

    getEvents(department: Department) {
        return this.root.eventStore.events.filter((e) => e.departmentIds.has(department.id));
    }

    @action
    reload() {
        if (this.root.sessionStore.account) {
            this.load();
        }
    }

    @action
    loadDepartment(id: string) {
        return this.loadModel(id);
    }
}
