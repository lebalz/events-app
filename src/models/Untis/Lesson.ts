import type { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisLesson } from '../../api/untis';
import SchoolEvent from '../SchoolEvent';
import { getLastMonday } from './helpers';

const MONDAY = Object.freeze(getLastMonday());

export default class Lesson {
    readonly id: number;
    readonly room: string;
    readonly subject: string;
    readonly description: string;
    readonly semester: string;
    readonly weekDay: number;
    readonly startDHHMM: number;
    readonly endDHHMM: number;


    private readonly store: UntisStore;

    constructor(props: UntisLesson, store: UntisStore) {
        this.id = props.id;
        this.room = props.room;
        this.subject = props.subject;
        this.description = props.description;
        this.semester = props.semester;
        this.weekDay = props.weekDay;
        this.startDHHMM = props.startDHHMM;
        this.endDHHMM = props.endDHHMM;

        this.store = store;
        makeObservable(this);
    }

}
