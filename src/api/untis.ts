import api from './base';
import { AxiosPromise, CancelTokenSource } from 'axios';
import { Job } from './job';
import { KlassName } from '../models/helpers/klassNames';


/**
 * Model UntisTeacher
 * 
 */
export interface UntisTeacher {
    id: number
    name: string
    longName: string
    title: string
    active: boolean
}

/**
 * Model UntisLesson
 * 
 */
export interface UntisLesson {
    id: number
    room: string
    subject: string
    description: string
    semester: number
    year: number
    weekDay: number
    startHHMM: number
    endHHMM: number
  }
interface RawUntisLesson {
    id: number
    room: string
    subject: string
    description: string
    semester: number
    year: number
    week_day: number
    start_hhmm: number
    end_hhmm: number
}

export interface UntisLessonWithTeacher extends UntisLesson {
    teachers: { id: number }[]
    classes: { id: number }[]
}

export interface CheckedUntisLesson extends RawUntisLesson {
    teacher_name: string;
    class_name: string;
}


export interface Subject {
    name: string;
    description: string;
    departmentName: string;
}


/**
 * Model UntisClass
 * 
 */
export interface UntisClass {
    id: number
    name: KlassName
    legacyName: string | null
    sf: string
    year: number
    departmentId: string | null
}
export interface UntisClassWithTeacher extends UntisClass {
    teachers: { id: number }[]
    lessons: { id: number }[]
}

export interface UntisTeacherComplete extends UntisTeacher {
    lessons: UntisLessonWithTeacher[]
}

export function classes(signal: AbortSignal): AxiosPromise<UntisClassWithTeacher[]> {
    return api.get('untis/class/all',  { signal });
}
export function subjects(signal: AbortSignal): AxiosPromise<Subject[]> {
    return api.get('untis/subjects',  { signal });
}
export function teachers(signal: AbortSignal): AxiosPromise<UntisTeacher[]> {
    return api.get('untis/teacher/all',  { signal });
}
export function teacher(untisId: number, signal: AbortSignal): AxiosPromise<UntisTeacherComplete> {
    return api.get(`untis/teacher/${untisId}`,  { signal });
}
export function sync(signal: AbortSignal): AxiosPromise<Job> {
    return api.post('untis/sync',  { signal });
}
