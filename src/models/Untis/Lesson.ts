import type { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisLessonWithTeacher } from '../../api/untis';
import SchoolEvent from '../SchoolEvent';
import { getLastMonday } from './helpers';

const MONDAY = Object.freeze(getLastMonday());

export default class Lesson {
    readonly id: number
    readonly room: string
    readonly subject: string
    readonly description: string
    readonly semester: string
    readonly weekDay: number
    readonly startDHHMM: number
    readonly endDHHMM: number
    readonly teacherIds: number[]
    readonly classIds: number[]


    private readonly store: UntisStore;

    constructor(props: UntisLessonWithTeacher, store: UntisStore) {
        this.id = props.id;
        this.room = props.room;
        this.subject = props.subject;
        this.description = props.description;
        this.semester = props.semester;
        this.weekDay = props.weekDay;
        this.startDHHMM = props.startDHHMM;
        this.endDHHMM = props.endDHHMM;
        this.teacherIds = props.teachers.map(t => t.id);
        this.classIds = props.classes.map(t => t.id);

        this.store = store;
        makeObservable(this);
    }

    @computed
    get teachers() {
        return this.teacherIds.map(t => this.store.findTeacher(t));
    }

    @computed
    get classes() {
        return this.classIds.map(t => this.store.findClass(t));
    }

}
