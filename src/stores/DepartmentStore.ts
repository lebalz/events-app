import { action, computed, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import {DepartmentLetter, Department as DepartmentProps} from '../api/department';
import Department from '../models/Department';
import { computedFn } from 'mobx-utils';

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
        return _.orderBy(this.models, ['name'], ['asc']);
    }

    @computed
    get letters() {
        return [...new Set(this.departments.map((d) => d.letter))].sort();
    }

    isValidClassGroup(group: string) {
        if (!group || group.length !== 3) {
            return false;
        }
        const match = group.match(/^(?<year>\d\d)(?<departmentLetter>[a-zA-Z])$/);
        if (!match) {
            return false;
        }
        const { departmentLetter } = match.groups as { year: string, departmentLetter: string, classLetter: string };
        return this.departments.some((d) => d.letter === departmentLetter);
    }

    isValidClass(klass: string) {
        if (!klass || klass.length !== 4) {
            return false;
        }
        const departmentLetter = klass[2];
        const departments = this.findByDepartmentLetter(departmentLetter);
        if (departments.length === 0) {
            return false;
        }
        const classLetter = klass[3];
        return departments.some((d) => d.classLetters.has(classLetter));
    }


    createModel(data: DepartmentProps): Department {
        return new Department(data, this);        
    }

    getEvents(department: Department) {
        return this.root.eventStore.events.filter((e) => e.departmentIdsAll.has(department.id));
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

    findByDepartmentLetter = computedFn(
        function (this: DepartmentStore, letter?: string): Department[] {
            if (!letter) {
                return [];
            }
            return this.departments.filter((d) => d.letter === letter);
        },
        { keepAlive: true }
    )

    letterToName = computedFn(
        function (this: DepartmentStore, letter?: string): string {
            const departments = this.findByDepartmentLetter(letter);
            if (departments.length < 1) {
                return letter || '';
            }
            const ascendingByLength = departments.map(d => d.name).sort((a, b) => a.length - b.length);
            return ascendingByLength[0];
        },
        { keepAlive: true }
    )

    @action
    loadDepartment(id: string) {
        return this.loadModel(id);
    }

    @computed
    get usedDepartments(): Department[] {
        const ids = [...new Set(this.root.eventStore.events.map((e) => [...e.departmentIdsAll]).flat())];
        return ids.map((id) => this.find<Department>(id)).filter(d => !!d).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * returns departments with at least one class and with a valid department letter
     */
    @computed
    get departmentsWithClasses(): Department[] {
        return this.departments.filter((d) => !!d.letter && d.classes.length > 0);
    }

    @computed
    get departmentsDe(): Department[] {
        return this.departmentsWithClasses.filter((d) => d.lang === 'de');
    }

    @computed
    get departmentsFr(): Department[] {
        return this.departmentsWithClasses.filter((d) => d.lang === 'fr');
    }

    /**
     * Returns a map of departments grouped by their letter.
     * @attention
     *  - departments without a letter are not included in the map.
     *  - departments without at least one class are not included in the map
     */
    @computed
    get groupedByLetter() {
        const departments = this.departmentsWithClasses.filter(d => d.classes.length > 0);
        const grouped = _.groupBy(departments, (d) => d.letter);
        return grouped;
    }
}
