import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Job } from './job';

export enum EventState {
    Draft = 'DRAFT',
    Review = 'REVIEW',
    Published = 'PUBLISHED',
    Deleted = 'DELETED',
    Refused = 'REFUSED'
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

export function importExcel(formData: FormData, signal: AbortSignal): AxiosPromise<Job> {
    return api.post('event/import', formData, { signal });
}


export function requestState(state: EventState, ids: string[], signal: AbortSignal): AxiosPromise<Event[]> {
    return api.post('event/change_state', {data: {ids: ids, state: state}}, { signal });
}
