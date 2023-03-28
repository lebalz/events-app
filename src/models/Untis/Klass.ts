import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisClassWithTeacher } from '../../api/untis';
import Department from '../Department';

export default class Klass {
    readonly id: number
    readonly name: string
    readonly sf: string
    readonly year: number
    readonly departmentId: string
    readonly teacherIds: number[]
    readonly lessonIds: number[]
    private readonly store: UntisStore;

    constructor(props: UntisClassWithTeacher, store: UntisStore) {
        this.store = store;
        this.id = props.id;
        this.name = props.name;
        this.sf = props.sf;
        this.year = props.year;
        this.departmentId = props.departmentId ?? '';
        this.teacherIds = props.teachers.map(t => t.id);
        this.lessonIds = props.lessons.map(t => t.id);

        makeObservable(this);
    }

    @computed
    get graduationYear() {
        return parseInt(this.name.slice(0, 2), 10) + 2000;
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
    get lessons() {
        const current = this.store.currentSemester;
        console.log('lid', this.lessonIds.map(t => this.store.findLesson(t)).filter(l => l?.semesterName === current.semesterName));
        return this.lessonIds.map(t => this.store.findLesson(t)).filter(l => l?.semesterName === current.semesterName);
    }

    @computed
    get department(): Department | undefined {
        return this.store.findDepartment(this.departmentId);
    }

}
