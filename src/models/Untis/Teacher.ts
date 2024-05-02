import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { UntisTeacher } from '../../api/untis';
import Department from '../Department';

const isLowerCase = (str: string) => {
    return str === str.toLowerCase();
}

const isUpperCase = (str: string) => {
    return str === str.toUpperCase();
}

const isFromDepartment = (departmentLetter: string, untisAbbrev: string) => {
    return (isUpperCase(departmentLetter) && isLowerCase(untisAbbrev)) || (isLowerCase(departmentLetter) && isUpperCase(untisAbbrev));
}

export default class Teacher {
    readonly id: number;
    readonly name: string;
    readonly longName: string;
    readonly title: string;
    readonly active: boolean;
    readonly hasUser: boolean;
    private readonly store: UntisStore;

    constructor(props: UntisTeacher, store: UntisStore) {
        this.id = props.id;
        this.name = props.name;
        this.longName = props.longName;
        this.title = props.title;
        this.active = props.active;
        this.store = store;
        this.hasUser = props.hasUser;

        makeObservable(this);
    }

    @computed
    get shortName() {
        return this.name;
    }

    @computed
    get classes() {
        return this.store.findClassesByTeacher(this.id);
    }

    @computed
    get departments(): Department[] {
        return [...new Set(this.classes.map(c => c.department).filter(d => d !== undefined))];
    }

    /**
     * only the relevant departments for this teacher
     */
    get usersDepartments(): Department[] {
        return [...new Set(this.lessons.flatMap(l => l.isEF ? l.classes.filter(c => isFromDepartment(c.departmentLetter, this.name)) : l.classes).map(c => c.department).filter(d => d !== undefined))];
    }

    @computed
    get lessons() {
      return this.store.findLessonsByTeacher(this.id);
    }

    @computed
    get user() {
        return this.store;
    }
}
