import api from './base';
import { AxiosPromise, CancelTokenSource } from 'axios';
import { Job } from './job';


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



/**
 * Model UntisClass
 * 
 */
export interface UntisClass {
    id: number
    name: string
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
export function teachers(signal: AbortSignal): AxiosPromise<UntisTeacher[]> {
    return api.get('untis/teacher/all',  { signal });
}
export function teacher(untisId: number, signal: AbortSignal): AxiosPromise<UntisTeacherComplete> {
    return api.get(`untis/teacher/${untisId}`,  { signal });
}
export function sync(signal: AbortSignal): AxiosPromise<Job> {
    return api.post('untis/sync',  { signal });
}
