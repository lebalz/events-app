import _ from 'lodash';
import Lesson from '../Untis/Lesson';
import { MINUTE_2_MS } from './time';

export enum LessonOverlap {
    None,
    Start,
    End,
    Full
}

const OFFSET = 25 * MINUTE_2_MS;

/**
 * checks if two lessons are subsequent, e.g. they overlap when 25 minutes are
 * - added to the end of the first lesson (returns LessonOverlap.End)
 * - subtracted from the start of the first lesson (returns LessonOverlap.Start)
 * @param lessonA compare this lesson
 * @param lessonB to this lesson
 * @returns
 */
export const lessonOverlap = (lessonA: Lesson, lessonB: Lesson): LessonOverlap => {
    if (lessonA.semesterId !== lessonB.semesterId) {
        return LessonOverlap.None;
    }
    if (lessonA.weekDay !== lessonB.weekDay) {
        return LessonOverlap.None;
    }
    if (lessonA.subject !== lessonB.subject) {
        return LessonOverlap.None;
    }
    if (!_.isEqual(lessonA.classIds, lessonB.classIds)) {
        return LessonOverlap.None;
    }
    if (!_.isEqual(lessonA.teacherIds, lessonB.teacherIds)) {
        return LessonOverlap.None;
    }
    if (lessonA.startHHMM === lessonB.startHHMM && lessonA.endHHMM === lessonB.endHHMM) {
        return LessonOverlap.Full;
    }
    if (
        lessonA.weekOffsetMS_end + OFFSET > lessonB.weekOffsetMS_start &&
        lessonA.weekOffsetMS_end < lessonB.weekOffsetMS_start
    ) {
        return LessonOverlap.End;
    }
    if (
        lessonA.weekOffsetMS_start < lessonA.weekOffsetMS_end + OFFSET &&
        lessonA.weekOffsetMS_start > lessonB.weekOffsetMS_end
    ) {
        return LessonOverlap.Start;
    }
    return LessonOverlap.None;
};
