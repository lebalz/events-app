import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Event } from './event';

export type Job = {
    id: string
    type: JobType
    state: JobState
    userId: string
    log?: string
    filename?: string
    createdAt: Date
    updatedAt: Date
}

export type JobAndEvents = Job & {
    events: Event[]
}

export enum JobType {
    IMPORT = 'IMPORT',
    CLONE = 'CLONE',
    SYNC_UNTIS = 'SYNC_UNTIS'
};

export enum JobState {
    PENDING = 'PENDING',
    ERROR = 'ERROR',
    DONE = 'DONE',
    REVERTED = 'REVERTED'
};