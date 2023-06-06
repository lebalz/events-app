import type { UntisStore } from '@site/src/stores/UntisStore';
import { computed, makeObservable } from 'mobx';
import { UntisLessonWithTeacher } from '../../api/untis';
import Event, { iEvent } from '../Event';
import { DAYS, DAY_2_MS, HOUR_2_MS, MINUTE_2_MS, getLastMonday } from '../helpers/time';
import _ from 'lodash';

const MONDAY = Object.freeze(getLastMonday());

const LESSON_DURATION_MS = 45 * MINUTE_2_MS;
const SUCCESSIVE_LESSON_THRESHOLD_MS = LESSON_DURATION_MS / 2;

export default class Lesson implements iEvent {
    readonly id: number
    readonly room: string
    readonly subject: string
    readonly description: string
    readonly semesterNr: number
    readonly year: number
    /** Sonntag: 0, Montag: 1, Dienstag: 2, ... */
    readonly weekDay: number
    readonly startHHMM: number
    readonly endHHMM: number
    readonly teacherIds: number[]
    readonly classIds: number[]
    readonly semesterId: string;


    private readonly store: UntisStore;

    constructor(props: UntisLessonWithTeacher, store: UntisStore) {
        this.id = props.id;
        this.room = props.room;
        this.subject = props.subject;
        this.description = props.description;
        this.semesterNr = props.semesterNr;
        this.year = props.year;
        this.semesterId = props.semesterId;
        this.weekDay = props.weekDay;
        this.startHHMM = props.startHHMM;
        this.endHHMM = props.endHHMM;
        this.teacherIds = props.teachers.map(t => t.id);
        this.classIds = props.classes.map(t => t.id);

        this.store = store;
        makeObservable(this);
    }

    static GroupedClassesByYear(lessons: Lesson[], threshold: number = 3): {[name: string]: string} {
        const efs = _.uniqBy(lessons.filter(l => l.isEF).map(l => l.classes).flat(), c => c?.id);
        const nonEfs = _.uniqBy(lessons.filter(l => !l.isEF).map(l => l.classes).flat(), c => c?.id);
        const klGroupsRaw = _.groupBy(_.uniqBy(nonEfs, l => l.id), c => c?.year);
        const klGroup: {[key: string]: string} = {};
        Object.keys(klGroupsRaw).forEach((year) => {
            if (klGroupsRaw[year].length > threshold) {
                klGroup[year] = `${year.slice(2)}`;
            } else {
                klGroup[year] = klGroupsRaw[year].map(c => c?.displayName).join(', ');
            }
        });
        const efYears = _.uniqBy(efs, c => c?.year).map(c => c?.year);
        efYears.forEach((year) => {
            klGroup[year] = `EF[${year % 100}]`;
        });
        return klGroup;
    }

    @computed
    get firstSuccessiveLesson(): Lesson | undefined {
        const first = this.semester.lessons.find((lesson) => {
            if (lesson.id === this.id) {
                return false;
            }
            // const isTime = lesson.weekOffsetMS_end < this.weekOffsetMS_start && (lesson.weekOffsetMS_end + SUCCESSIVE_LESSON_THRESHOLD_MS) >= this.weekOffsetMS_start
            // const isSubject = lesson.subject === this.subject
            // const isRoom =  lesson.room === this.room
            // const isTeacher = _.isEqual(lesson.teacherIds, this.teacherIds)
            // const isKlass = _.isEqual(lesson.classIds, this.classIds);
            // if (isRoom && isSubject) {
            //     console.log(this.props, 'isTime', isTime, 'isSubject', isSubject, 'isRoom', isRoom, 'isTeacher', isTeacher, 'isKlass', isKlass, lesson.props);
            // }
            // return isTime && isSubject && isRoom && isTeacher && isKlass;
            // )
            return (
                lesson.subject === this.subject
                && lesson.room === this.room
                && lesson.weekOffsetMS_end < this.weekOffsetMS_start 
                && (lesson.weekOffsetMS_end + SUCCESSIVE_LESSON_THRESHOLD_MS) >= this.weekOffsetMS_start
                && _.isEqual(lesson.teacherIds, this.teacherIds)
                && _.isEqual(lesson.classIds, this.classIds)
            )
        });
        return first?.firstSuccessiveLesson ?? first;
    }

    @computed
    get lastSuccessiveLesson(): Lesson | undefined {
        const last = this.semester.lessons.find((lesson) => {
            if (lesson.id === this.id) {
                return false;
            }
            return (
                lesson.subject === this.subject
                && lesson.room === this.room
                && lesson.weekOffsetMS_start > this.weekOffsetMS_end 
                && lesson.weekOffsetMS_start <= this.weekOffsetMS_end + SUCCESSIVE_LESSON_THRESHOLD_MS
                && _.isEqual(lesson.teacherIds, this.teacherIds)
                && _.isEqual(lesson.classIds, this.classIds)
            )
        });
        // console.log(this.props, first?.props);
        return last?.lastSuccessiveLesson ?? last;
    }

    @computed
    get isFirstSuccessiveLesson() {
        return !this.firstSuccessiveLesson;
    }


    @computed
    get isEF() {
        return this.subject.startsWith('EF') || this.subject.startsWith('OC');
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
    get semester() {
        return this.store.findSemester(this.semesterId);
    }

    hasOverlap(other: Event) {
        if (!other) {
            return false;
        }
        return other.hasOverlap(this);
    }

    @computed
    get props() {
        return {
            id: this.id,
            room: this.room,
            subject: this.subject,
            startHHMM: this.startHHMM,
            endHHMM: this.endHHMM,
            teacherIds: this.teacherIds.slice(),
            classIds: this.classIds.slice(),
            s: this.weekOffsetMS_start,
            e: this.weekOffsetMS_end,
            eo: this.weekOffsetMS_end + SUCCESSIVE_LESSON_THRESHOLD_MS,
        }
    }
}
