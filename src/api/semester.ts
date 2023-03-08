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

export function create(data: Partial<Semester>, cancelToken: CancelTokenSource): AxiosPromise<Semester> {
    return api.post('semester', data, { cancelToken: cancelToken.token });
}

export function find(id: string, cancelToken: CancelTokenSource): AxiosPromise<Semester> {
    return api.get(`semester/${id}`, { cancelToken: cancelToken.token });
}

export function update(id: string, delta: Partial<Semester>, cancelToken: CancelTokenSource): AxiosPromise<Semester> {
    return api.patch(`semester/${id}`, { data: delta }, { cancelToken: cancelToken.token });
}

export function destroy(id: string, cancelToken: CancelTokenSource): AxiosPromise<void> {
    return api.delete(`semester/${id}`, { cancelToken: cancelToken.token });
}

