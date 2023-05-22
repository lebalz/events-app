import type { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisLessonWithTeacher } from '../../api/untis';
import Event, { iEvent } from '../Event';
import { DAYS, DAY_2_MS, HOUR_2_MS, MINUTE_2_MS, getLastMonday } from '../helpers/time';

const MONDAY = Object.freeze(getLastMonday());

export default class Lesson implements iEvent {
    readonly id: number
    readonly room: string
    readonly subject: string
    readonly description: string
    readonly semester: number
    readonly year: number
    /** Sonntag: 0, Montag: 1, Dienstag: 2, ... */
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
        this.year = props.year;
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
        date.setDate(date.getDate() + this.weekDay - 1);
        date.setHours(Math.floor(this.startHHMM / 100));
        date.setMinutes(this.startHHMM % 100);
        return date;
    }

    @computed
    get end() {
        const date = new Date(MONDAY);
        date.setDate(date.getDate() + this.weekDay - 1);
        date.setHours(Math.floor(this.endHHMM / 100));
        date.setMinutes(this.endHHMM % 100);
        return date;
    }

    @computed
    get fStart() {
        return `${this.start.getHours().toString().padStart(2, '0')}:${this.start.getMinutes().toString().padStart(2, '0')}`;
    }

    @computed
    get fEnd() {
        return `${this.end.getHours().toString().padStart(2, '0')}:${this.end.getMinutes().toString().padStart(2, '0')}`;
    }

    @computed
    get day() {
        return DAYS[this.weekDay];
    }

    @computed
    get teachers() {
        return this.teacherIds.map(t => this.store.findTeacher(t)).filter(t => t);
    }

    @computed
    get classes() {
        return this.classIds.map(t => this.store.findClass(t)).filter(t => t);
    }

    @computed
    get weekOffsetMS_start() {
        const hours = Math.floor(this.startHHMM / 100);
        const minute = this.startHHMM % 100;
        return this.weekDay * DAY_2_MS + hours * HOUR_2_MS + minute * MINUTE_2_MS;
    }

    @computed
    get weekOffsetMS_end() {
        const hours = Math.floor(this.endHHMM / 100);
        const minute = this.endHHMM % 100;
        return this.weekDay * DAY_2_MS + hours * HOUR_2_MS + minute * MINUTE_2_MS;
    }

    @computed
    get semesterName(): `${number}HS` | `${number}FS` {
        const suffix = ["HS", "FS"][this.semester - 1] as 'HS' | 'FS';
        return `${this.year}${suffix}`;
    }

    hasOverlap(other: Event) {
        if (!other) {
            return false;
        }
        return other.hasOverlap(this);
    }
}
