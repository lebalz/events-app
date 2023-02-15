import api from './base';
import { AxiosPromise, CancelTokenSource } from 'axios';
import { Departments } from './event';


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

export interface UntisTeacherComplete extends UntisTeacher {
    lessons: UntisLesson[]
    classes: UntisClass[]
}

/**
 * Model UntisLesson
 * 
 */
export type UntisLesson = {
    id: number
    room: string
    subject: string
    description: string
    semester: string
    weekDay: number
    startDHHMM: number
    endDHHMM: number
}

/**
 * Model UntisClass
 * 
 */
export type UntisClass = {
    id: number
    name: string
    sf: string
    department: Departments
}

export function teachers(cancelToken: CancelTokenSource): AxiosPromise<UntisTeacher[]> {
    return api.get('untis/teacher/all', { cancelToken: cancelToken.token });
}
export function teacher(untisId: number, cancelToken: CancelTokenSource): AxiosPromise<UntisTeacherComplete> {
    return api.get(`untis/teacher/${untisId}`, { cancelToken: cancelToken.token });
}
export function sync(cancelToken: CancelTokenSource): AxiosPromise<any> {
    return api.post('untis/sync', { cancelToken: cancelToken.token });
}
