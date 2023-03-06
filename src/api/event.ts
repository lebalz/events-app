import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Job } from './job';

export enum EventState {
    Draft = 'DRAFT',
    Review = 'REVIEW',
    Published = 'PUBLISHED',
    Deleted = 'DELETED',
}
export interface Event {
    id: string
    authorId: string
    start: string
    end: string
    allDay: boolean
    location: string
    description: string
    descriptionLong: string
    departmentIds: string[]
    classes: string[]
    state: EventState
    jobId: string | null
    createdAt: string
    updatedAt: string
}

export function find(id: string, cancelToken: CancelTokenSource): AxiosPromise<Event> {
    return api.get(`event/${id}`, { cancelToken: cancelToken.token });
}
export function events(cancelToken: CancelTokenSource): AxiosPromise<Event[]> {
    return api.get('event/all', { cancelToken: cancelToken.token });
}

export function create(data: Partial<Event>, cancelToken: CancelTokenSource): AxiosPromise<Event> {
    return api.post('event', data, { cancelToken: cancelToken.token });
}

export function update(id: string, data: Event, cancelToken: CancelTokenSource): AxiosPromise<{ updatedAt: string }> {
    return api.put(`event/${id}`, { data: data }, { cancelToken: cancelToken.token });
}

export function destroy(event: Event, cancelToken: CancelTokenSource) {
    return api.delete('event', { cancelToken: cancelToken.token });
}

export function importExcel(formData: FormData, cancelToken: CancelTokenSource): AxiosPromise<Job> {
    return api.post('event/import', formData, { cancelToken: cancelToken.token });
}
