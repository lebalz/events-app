import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface Semester {
    id: string
    name: string
    start: string
    end: string
    createdAt: string
    updatedAt: string
}


export function semesters(cancelToken: CancelTokenSource): AxiosPromise<Semester[]> {
    return api.get('semester/all', { cancelToken: cancelToken.token });
}