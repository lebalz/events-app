import { action, computed, makeObservable, observable } from 'mobx';
import _ from 'lodash';
import { RootStore } from './stores';
import iStore from './iStore';
import { Department as DepartmentProps } from '../api/department';
import Department from '../models/Department';
import { computedFn } from 'mobx-utils';
import { EndPoint } from './EndPoint';
import { translate } from '@docusaurus/Translate';

export class DepartmentStore extends iStore<DepartmentProps> {
    readonly root: RootStore;

    @observable.ref accessor ApiEndpoint = new EndPoint('departments', { public: true });

    models = observable<Department>([]);

    constructor(root: RootStore) {
        super();
        this.root = root;
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
        const { departmentLetter } = match.groups as {
            year: string;
            departmentLetter: string;
        };
        return this.departments.some((d) => d.letter === departmentLetter);
    }

    isValidClass(klass: string, matchDisplayLetter?: boolean) {
        if (!klass || klass.length !== 4) {
            return false;
        }
        const year = Number.parseInt(klass.slice(0, 2));
        if (Number.isNaN(year)) {
            return false;
        }
        const departmentLetter = klass[2];
        const departments = this.departments.filter(
            (d) =>
                d.letter === departmentLetter || (matchDisplayLetter && d._displayLetter === departmentLetter)
        );
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

    @computed
    get getUsedUnknownClassNames() {
        return this.root.eventStore.getUsedUnknownClassNames;
    }

    @computed
    get displayLetterMap() {
        return this.departments.reduce(
            (acc, d) => {
                if (d.letter) {
                    acc[d.letter] = d._displayLetter || d.letter;
                }
                return acc;
            },
            {} as Record<string, string>
        );
    }

    formatClassName(name: string) {
        if (name.length < 3) {
            return name;
        }
        const departmentLetter = name[2];
        return `${name.slice(0, 2)}${this.displayLetterMap[departmentLetter] || departmentLetter}${name.slice(3)}`;
    }

    @action
    reload() {
        if (this.root.sessionStore.isLoggedIn) {
            this.resetUserData();
            this.loadPublic(this.root.viewStore.semesterId);
        }
    }

    findByClassGroupName = (classGroupName: string) => {
        if (!this.isValidClassGroup(classGroupName)) {
            return undefined;
        }
        const letter = classGroupName.charAt(2);
        return this.departments.find((d) => d.letter === letter);
    };

    findByDepartmentLetter = computedFn(
        function (this: DepartmentStore, letter?: string): Department[] {
            if (!letter) {
                return [];
            }
            return this.departments.filter((d) => d.letter === letter);
        },
        { keepAlive: true }
    );

    letterToName = computedFn(
        function (this: DepartmentStore, letter?: string): string {
            const departments = this.findByDepartmentLetter(letter);
            if (departments.length < 1) {
                return letter || '';
            }
            const ascendingByLength = departments.map((d) => d.name).sort((a, b) => a.length - b.length);
            return ascendingByLength[0];
        },
        { keepAlive: true }
    );

    @action
    loadDepartment(id: string) {
        return this.loadModel(id);
    }

    @computed
    get usedDepartments(): Department[] {
        const ids = [...new Set(this.root.eventStore.events.map((e) => [...e.departmentIdsAll]).flat())];
        return ids
            .map((id) => this.find<Department>(id))
            .filter((d) => !!d)
            .sort((a, b) => a.name.localeCompare(b.name));
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
        const singleYearDepartments = this.departmentsWithClasses.filter((d) => d.schoolYears <= 1);
        const multiYearDepartments = this.departmentsWithClasses.filter((d) => d.schoolYears > 1);
        const grouped = _.groupBy(multiYearDepartments, (d) => d.letter);
        return {
            ...grouped,
            [translate({
                message: 'Weitere',
                id: 'departmentStore.groupedByLetter.more',
                description: 'For the class picker: the rest of the classes, MSOP, FMPäd, Passerelle'
            })]: singleYearDepartments
        };
    }
}
