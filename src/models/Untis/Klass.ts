import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisClassWithTeacher } from '../../api/untis';

export default class Klass {
    readonly id: number
    readonly name: string
    readonly sf: string
    readonly departmentIds: string[]
    readonly teacherIds: number[]
    readonly lessonIds: number[]
    private readonly store: UntisStore;

    constructor(props: UntisClassWithTeacher, store: UntisStore) {
        this.id = props.id;
        this.name = props.name;
        this.sf = props.sf;
        this.departmentIds = props.departmentIds;
        this.teacherIds = props.teachers.map(t => t.id);
        this.lessonIds = props.lessons.map(t => t.id);

        this.store = store;
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
        return this.lessonIds.map(t => this.store.findLesson(t));
    }

}
