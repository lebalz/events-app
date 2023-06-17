import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Job } from './job';
import Joi from 'joi';
import { KlassName } from '../models/helpers/klassNames';

export enum EventState {
    Draft = 'DRAFT',
    Review = 'REVIEW',
    Published = 'PUBLISHED',
    Refused = 'REFUSED'
}

export enum TeachingAffected {
    YES = 'YES',
    PARTIAL = 'PARTIAL',
    NO = 'NO'
}

export interface PrismaEvent {
    id: string
    authorId: string
    start: string
    end: string
    location: string
    description: string
    descriptionLong: string
    state: EventState
    cloned: boolean
    jobId: string | null
    classes: KlassName[]
    classGroups: string[]
    teachersOnly: boolean
    klpOnly: boolean
    parentId: string | null
    userGroupId: string | null
    teachingAffected: TeachingAffected
    subjects: string[]
    createdAt: string
    updatedAt: string
    deletedAt?: string
}

export interface Event extends PrismaEvent {
    departmentIds: string[]
}

const TODAY = new Date();

export const JoiEvent = Joi.object<Event>({
    id: Joi.string().required(),
    authorId: Joi.string().required(),
    start: Joi.date().iso().min(`${TODAY.getFullYear()-1}-01-01`).required(),
    end: Joi.date().iso().required().min(Joi.ref('start')).required(),
    location: Joi.string().required().allow(''),
    description: Joi.string().required(),
    descriptionLong: Joi.string().required().allow(''),
    departmentIds: Joi.array().items(Joi.string()).required(),
    classes: Joi.array().items(Joi.string()).required(),
    classGroups: Joi.array().items(Joi.string()).required(),
    state: Joi.string().valid(...Object.values(EventState)).required(),
    cloned: Joi.boolean().required(),
    jobId: Joi.string().allow(null),
    teachersOnly: Joi.boolean(),
    teachingAffected: Joi.string().valid(...Object.values(TeachingAffected)).required(),
    klpOnly: Joi.boolean(),
    subjects: Joi.array().items(Joi.string()).when('teachersOnly', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.array().empty().required()
    }),
    parentId: Joi.string().allow(null),
    userGroupId: Joi.string().allow(null),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
    deletedAt: Joi.date().iso().allow(null)
});

export function importExcel(formData: FormData, signal: AbortSignal): AxiosPromise<Job> {
    return api.post('event/import', formData, { signal });
}


export function requestState(state: EventState, ids: string[], signal: AbortSignal): AxiosPromise<Event[]> {
    return api.post('event/change_state', {data: {ids: ids, state: state}}, { signal });
}

export function excel(signal: AbortSignal): AxiosPromise {
    return api.post(
        'event/excel',
        {},
        {
            method: 'GET',
            responseType: 'blob', // important
            signal
        }
    );
}

export function clone(eventId: string, signal: AbortSignal): AxiosPromise<Event> {
    return api.post(
        `event/${eventId}/clone`,
        {},
        { signal}
    );
}
