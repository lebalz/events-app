import type { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { Lesson as LessonProps } from '../../api/untis';
import SchoolEvent from '../SchoolEvent';
import { getLastMonday } from './helpers';

const MONDAY = Object.freeze(getLastMonday());

export default class Lesson {
    readonly id: number;
    readonly lesson_id: number;
    readonly lesson_number: number;
    readonly start_time: number;
    readonly end_time: number;
    readonly class_ids: number[];
    readonly teacher_ids: number[];
    readonly subject_id: number;
    readonly schoolyear_id: number;

    readonly _local_timestamp_start: number;
    readonly _local_timestamp_end: number;

    private readonly store: UntisStore;

    constructor(props: LessonProps, schoolyear_id: number, store: UntisStore) {
        this.id = props.id;
        this.lesson_id = props.lesson_id;
        this.lesson_number = props.lesson_number;
        this.start_time = props.start_time;
        this.end_time = props.end_time;
        this.class_ids = props.class_ids;
        this.teacher_ids = props.teacher_ids;
        this.subject_id = props.subject_id;
        this.schoolyear_id = schoolyear_id;
        this.store = store;

        
        const start = new Date(MONDAY.getTime())
        start.setMilliseconds(this.start_time);
        this._local_timestamp_start = start.getTime() + start.getTimezoneOffset() * 60000;
        
        const ende = new Date(MONDAY.getTime());
        ende.setMilliseconds(this.end_time);
        this._local_timestamp_end = ende.getTime() + ende.getTimezoneOffset() * 60000;

        makeObservable(this);
    }

    @computed
    get durationMinutes() {
        return (this.end_time - this.start_time) / 1000 / 60;
    }

    @computed
    get weekday() {
        return Math.floor(this.start_time / 1000 / 60 / 60 / 24);
    }

    @computed
    get schoolyear() {
        return this.store.findSchoolyear(this.schoolyear_id);
    }

    @computed
    get classes() {
        return this.class_ids.map((id) => this.store.findClass(id));
    }
    @computed
    get teachers() {
        return this.teacher_ids.map((id) => this.store.findTeacher(id));
    }
    @computed
    get subject() {
        return this.store.findSubject(this.subject_id);
    }
    @computed
    get subjectName() {
        return this.subject.name;
    }

    get startTime() {
        // const start = new Date(MONDAY.getTime())
        // start.setMilliseconds(this.start_time);
        // return start;
        return new Date(this._local_timestamp_start);
    }

    get startTimeStr() {
        const start = this.startTime
        return `${start.getHours()}:${start.getMinutes()}`;
    }
    get endTime() {
        // const ende = new Date(MONDAY.getTime())
        // ende.setMilliseconds(this.end_time);
        // return ende;
        return new Date(this._local_timestamp_end);
    }
    get endTimeStr() {
        const ende = this.endTime
        return `${ende.getHours()}:${ende.getMinutes()}`;
    }

    isAffected(event: SchoolEvent) {
        // console.log(this.subjectName, this.id, event.weeksMonday.add(292800000, 'milliseconds').format(), event.start.format())
        // console.log('weekOffsetMS_start', event.weekOffsetMS_start)
        // console.log('weekOffsetMS_end', event.weekOffsetMS_end)
        // console.log('start_time', this.start_time)
        // console.log('end_time', this.end_time)
        // console.log('-----------------------')
        /* event        |<------------>|
       lesson   |<------------>|          */
        const startOverlap =
            event.weekOffsetMS_start > this.start_time && event.weekOffsetMS_start < this.end_time;

        /* event        |<---->|
       lesson   |<------------>|          */
        const eventInside =
            event.weekOffsetMS_start > this.start_time && event.weekOffsetMS_end < this.end_time;

        /* event       |<--------------->|
       lesson          |<------>|          */
        const lessonInside =
            event.weekOffsetMS_start < this.start_time && event.weekOffsetMS_end > this.end_time;

        /* event        |<------------>|
       lesson           |<------------>|          */
        const endOverlap = event.weekOffsetMS_end > this.start_time && event.weekOffsetMS_end < this.end_time;

        return startOverlap || endOverlap || eventInside || lessonInside;
    }
}
