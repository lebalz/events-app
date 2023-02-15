import { Departments } from '@site/src/api/event';
import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { UntisClass } from '../../api/untis';

export default class Klass {
    readonly id: number
    readonly name: string
    readonly sf: string
    readonly department?: Departments
    private readonly store: UntisStore;

    constructor(props: UntisClass, store: UntisStore) {
        this.id = props.id;
        this.name = props.name;
        this.sf = props.sf;
        this.department = props.department;

        this.store = store;
        makeObservable(this);
    }
}
