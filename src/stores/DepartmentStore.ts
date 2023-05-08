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

    getClasses(department: Department) {
        return this.root.untisStore.findClassesByDepartment(department.id);
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

    @computed
    get usedDepartments(): Department[] {
        const ids = [...new Set(this.root.eventStore.events.map((e) => [...e.departmentIds]).flat())];
        return ids.map((id) => this.find<Department>(id)).filter(d => !!d).sort((a, b) => a.name.localeCompare(b.name));
    }
}
