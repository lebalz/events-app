import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Job } from './job';
import Joi from 'joi';

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
    teachersOnly: boolean
    klpOnly: boolean
    createdAt: string
    updatedAt: string
}

export const JoiEvent = Joi.object<Event>({
    id: Joi.string().required(),
    authorId: Joi.string().required(),
    start: Joi.date().iso().required(),
    end: Joi.date().iso().required().greater(Joi.ref('start')),
    allDay: Joi.boolean(),
    location: Joi.string().required().allow(''),
    description: Joi.string().required(),
    descriptionLong: Joi.string().required().allow(''),
    departmentIds: Joi.array().items(Joi.string()).required(),
    classes: Joi.array().items(Joi.string()).required(),
    state: Joi.string().valid(...Object.values(EventState)).required(),
    jobId: Joi.string(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
});

export function importExcel(formData: FormData, signal: AbortSignal): AxiosPromise<Job> {
    return api.post('event/import', formData, { signal });
}


export function requestState(state: EventState, ids: string[], signal: AbortSignal): AxiosPromise<Event[]> {
    return api.post('event/change_state', {data: {ids: ids, state: state}}, { signal });
}
