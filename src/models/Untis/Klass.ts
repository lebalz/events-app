import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisClassWithTeacher } from '../../api/untis';
import Department from '../Department';
import { KlassName, mapLegacyClassName } from '../helpers/klassNames';
import { DepartmentLetter, toDepartmentName } from '../helpers/departmentNames';
import Teacher from './Teacher';

export default class Klass {
    readonly id: number
    readonly _name: string
    readonly sf: string
    readonly year: number
    readonly departmentId: string
    readonly teacherIds: number[]
    readonly lessonIds: number[]
    private readonly store: UntisStore;

    constructor(props: UntisClassWithTeacher, store: UntisStore) {
        this.store = store;
        this.id = props.id;
        this._name = props.name;
        this.sf = props.sf;
        this.year = props.year;
        this.departmentId = props.departmentId ?? '';
        this.teacherIds = props.teachers.map(t => t.id);
        this.lessonIds = props.lessons.map(t => t.id);

        makeObservable(this);
    }

    @computed
    get name(): KlassName {
        if (this.graduationYear > 2026) {
            return this._name as KlassName;
        }
        return mapLegacyClassName(this._name) as KlassName;
    }

    @computed
    get departmentLetter(): DepartmentLetter {
        return this.name.slice(2, 3) as DepartmentLetter;
    }

    @computed
    get departmentName(): string {
        return toDepartmentName(this.name);
    }

    @computed
    get graduationYear() {
        return parseInt(this._name.slice(0, 2), 10) + 2000;
    }

    @computed
    get letter() {
        return this.name.slice(2);
    }

    @computed
    get teachers() {
        return this.teacherIds.map(t => this.store.findTeacher(t));
    }

    @computed
    get klp(): Teacher | undefined {
        const ks = this.lessons.find(l => l.subject==='KS' || l.subject==='MC');
        return ks.teachers && ks.teachers[0];
    }

    @computed
    get lessons() {
        const current = this.store.currentSemester;
        return this.lessonIds.map(t => this.store.findLesson(t)).filter(l => l?.semesterName === current.semesterName);
    }

    @computed
    get department(): Department | undefined {
        return this.store.findDepartment(this.departmentId);
    }

}