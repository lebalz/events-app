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

export function importExcel(formData: FormData, cancelToken: CancelTokenSource): AxiosPromise<Job> {
    return api.post('event/import', formData, { cancelToken: cancelToken.token });
}
