import { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable, observable } from 'mobx';
import moment from 'moment';
import { Lesson as LessonProps } from '../../api/untis';
import SchoolEvent, { getTime } from '../SchoolEvent';

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

    get startTimeStr() {
        const monday = moment().utc().startOf('isoWeek');
        return monday.add(this.start_time, 'milliseconds').format('HH:mm');
    }
    get endTimeStr() {
        const monday = moment().utc().startOf('isoWeek');
        return monday.add(this.end_time, 'milliseconds').format('HH:mm');
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
