import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import { UntisClass } from '../../api/untis';

export default class Klass {
    readonly id: number;
    readonly name: string;
    readonly sf: string;
    readonly active: boolean;
    readonly schoolyear_id: number;
    private readonly store: UntisStore;

    constructor(props: UntisClass, schoolyear_id: number, store: UntisStore) {
        this.id = props.id;
        this.name = props.name;
        this.sf = props.sf;

        this.store = store;

        makeObservable(this);
    }
}
