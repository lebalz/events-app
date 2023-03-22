import type { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisLessonWithTeacher } from '../../api/untis';
import { DAY_2_MS, HOUR_2_MS, MINUTE_2_MS } from '../helpers/time';
import { getLastMonday } from './helpers';

const MONDAY = Object.freeze(getLastMonday());

export default class Lesson {
    readonly id: number
    readonly room: string
    readonly subject: string
    readonly description: string
    readonly semester: string
    readonly weekDay: number
    readonly startHHMM: number
    readonly endHHMM: number
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
        this.startHHMM = props.startHHMM;
        this.endHHMM = props.endHHMM;
        this.teacherIds = props.teachers.map(t => t.id);
        this.classIds = props.classes.map(t => t.id);

        this.store = store;
        makeObservable(this);
    }

    @computed
    get start() {
        const date = new Date(MONDAY);
        date.setDate(date.getDate() + this.weekDay);
        date.setHours(this.startHHMM / 100);
        date.setMinutes(this.startHHMM % 100);
        return date;
    }

    @computed
    get end() {
        const date = new Date(MONDAY);
        date.setDate(date.getDate() + this.weekDay);
        date.setHours(this.endHHMM / 100);
        date.setMinutes(this.endHHMM % 100);
        return date;
    }

    @computed
    get teachers() {
        return this.teacherIds.map(t => this.store.findTeacher(t));
    }

    @computed
    get classes() {
        return this.classIds.map(t => this.store.findClass(t));
    }

    @computed
    get weekOffsetMS_start() {
        const hours = this.startHHMM / 100;
        const minute = this.startHHMM % 100;
        return this.weekDay * DAY_2_MS + hours * HOUR_2_MS + minute * MINUTE_2_MS;
    }

    @computed
    get weekOffsetMS_end() {
        const hours = this.endHHMM / 100;
        const minute = this.endHHMM % 100;
        return this.weekDay * DAY_2_MS + hours * HOUR_2_MS + minute * MINUTE_2_MS;
    }
}
