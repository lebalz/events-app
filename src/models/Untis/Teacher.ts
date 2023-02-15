import { Departments } from '@site/src/api/event';
import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { UntisTeacher } from '../../api/untis';


export default class Teacher {
    readonly id: number;
    readonly name: string;
    readonly longName: string;
    readonly title: string;
    readonly active: boolean;
    readonly teacherIds: number[]
    private readonly store: UntisStore;

    constructor(props: UntisTeacher, store: UntisStore) {
        this.id = props.id;
        this.name = props.name;
        this.longName = props.longName;
        this.title = props.title;
        this.active = props.active;
        this.store = store;

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
    get departments(): Departments[] {
        return this.classes.map(c => c.department).filter(d => d !== undefined);
    }
    @computed
    get lessons() {
      return this.store.findLessonsByTeacher(this.id);
    }
}
