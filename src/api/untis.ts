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
    semester: string
    weekDay: number
    startHHMM: number
    endHHMM: number
  }

export interface UntisLessonWithTeacher extends UntisLesson {
    teachers: { id: number }[]
    classes: { id: number }[]
}



/**
 * Model UntisClass
 * 
 */
export interface UntisClass {
    id: number
    name: string
    sf: string
    departmentIds: string[]
}
export interface UntisClassWithTeacher extends UntisClass {
    teachers: { id: number }[]
    lessons: { id: number }[]
}

export interface UntisTeacherComplete extends UntisTeacher {
    lessons: UntisLessonWithTeacher[]
    classes: UntisClassWithTeacher[]
}

export function teachers(cancelToken: CancelTokenSource): AxiosPromise<UntisTeacher[]> {
    return api.get('untis/teacher/all', { cancelToken: cancelToken.token });
}
export function teacher(untisId: number, cancelToken: CancelTokenSource): AxiosPromise<UntisTeacherComplete> {
    return api.get(`untis/teacher/${untisId}`, { cancelToken: cancelToken.token });
}
export function sync(cancelToken: CancelTokenSource): AxiosPromise<Job> {
    return api.post('untis/sync', { cancelToken: cancelToken.token });
}
