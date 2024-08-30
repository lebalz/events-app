import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { UntisTeacher } from '../../api/untis';
import Department from '../Department';

const isLowerCase = (str: string) => {
    return str === str.toLowerCase();
};

const isUpperCase = (str: string) => {
    return str === str.toUpperCase();
};

const isFromDepartment = (departmentLetter: string, untisAbbrev: string) => {
    return (
        (isUpperCase(departmentLetter) && isLowerCase(untisAbbrev)) ||
        (isLowerCase(departmentLetter) && isUpperCase(untisAbbrev))
    );
};

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

    get props(): UntisTeacher {
        return {
            id: this.id,
            name: this.name,
            longName: this.longName,
            title: this.title,
            active: this.active,
            hasUser: this.hasUser
        };
    }

    @computed
    get shortName() {
        return this.name;
    }

    @computed
    get classes() {
        const semesterId = this.store.currentSemester?.id;
        return this.store
            .findClassesByTeacher(this.id)
            .filter((c) => c.lessons.some((l) => l.semesterId === semesterId));
    }

    @computed
    get departments(): Department[] {
        return [...new Set(this.classes.map((c) => c.department).filter((d) => d !== undefined))];
    }

    @computed
    get lessons() {
        const semesterId = this.store.currentSemester?.id;
        return this.store.findLessonsByTeacher(this.id).filter((l) => l.semesterId === semesterId);
    }

    @computed
    get user() {
        return this.store;
    }
}
