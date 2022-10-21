import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { Klass as KlassProps } from '../../api/untis';

export default class Klass {
    readonly id: number;
    readonly name: string;
    readonly longName: string;
    readonly active: boolean;
    readonly did: number;
    readonly teacher1: number;
    readonly schoolyear_id: number;
    private readonly store: UntisStore;

    constructor(props: KlassProps, schoolyear_id: number, store: UntisStore) {
        this.id = props.id;
        this.name = props.name;
        this.longName = props.longName;
        this.active = props.active;
        this.did = props.did;
        this.teacher1 = props.teacher1;
        this.schoolyear_id = schoolyear_id;
        this.store = store;

        makeObservable(this);
    }

    @computed
    get schoolyear() {
        return this.store.findSchoolyear(this.schoolyear_id);
    }

    @computed
    get classTeacher() {
      return this.store.findTeacher(this.teacher1);
    }
    @computed
    get department() {
      return this.store.findDepartment(this.did);
    }
    @computed
    get lessons() {
      return this.store.filterLessonsByClass(this.id);
    }
}
