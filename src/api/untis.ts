import api from './base';
import { AxiosPromise } from 'axios';
import { KlassName } from '../models/helpers/klassNames';

/**
 * Model UntisTeacher
 *
 */
export interface UntisTeacher {
    id: number;
    name: string;
    longName: string;
    title: string;
    active: boolean;
    hasUser: boolean;
}

/**
 * Model UntisLesson
 *
 */
export interface UntisLesson {
    id: number;
    room: string;
    subject: string;
    description: string;
    semesterNr: number;
    year: number;
    semesterId: string;
    weekDay: number;
    startHHMM: number;
    endHHMM: number;
}

export interface UntisLessonWithTeacher extends UntisLesson {
    teacherIds: number[];
    classIds: number[];
}

export interface CheckedUntisLesson extends UntisLesson {
    teacherIds: number[];
    classIds: number[];
}

export interface Subject {
    name: string;
    description: string;
    departmentIds: string[];
}

/**
 * Model UntisClass
 *
 */
export interface UntisClass {
    id: number;
    name: KlassName;
    displayName: string | null;
    sf: string;
    year: number;
    departmentId: string | null;
}
export interface UntisClassWithTeacher extends UntisClass {
    teacherIds: number[];
    lessonIds: number[];
}

export interface UntisTeacherComplete extends UntisTeacher {
    lessons: UntisLessonWithTeacher[];
}

export function classes(signal: AbortSignal): AxiosPromise<UntisClassWithTeacher[]> {
    return api.get('untis/classes', { signal });
}
export function subjects(signal: AbortSignal): AxiosPromise<Subject[]> {
    return api.get('untis/subjects', { signal });
}
export function teachers(signal: AbortSignal): AxiosPromise<UntisTeacher[]> {
    return api.get('untis/teachers', { signal });
}
export function teacher(
    untisId: number,
    signal: AbortSignal,
    semesterId?: string
): AxiosPromise<UntisTeacherComplete> {
    if (semesterId) {
        return api.get(`untis/teachers/${untisId}?semesterId=${semesterId}`, { signal });
    }
    return api.get(`untis/teachers/${untisId}`, { signal });
}
