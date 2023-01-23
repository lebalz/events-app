import api from './base';
import { AxiosPromise, CancelTokenSource } from 'axios';


/**
 * Model UntisTeacher
 * 
 */
export type UntisTeacher = {
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
}

export function teachers(cancelToken: CancelTokenSource): AxiosPromise<UntisTeacher[]> {
    return api.get('untis/teachers', { cancelToken: cancelToken.token });
}
export function sync(cancelToken: CancelTokenSource): AxiosPromise<any> {
    return api.post('untis/sync', { cancelToken: cancelToken.token });
}
