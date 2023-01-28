import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Event } from './event';

export type Job = {
    id: string
    type: JobType
    state: JobState
    userId: string
    log: string
    filename?: string
    createdAt: Date
    updatedAt: Date
}

type JobAndEvents = Job & {
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


export function find(id: string, cancelToken: CancelTokenSource): AxiosPromise<JobAndEvents> {
    return api.get(`job/${id}`, { cancelToken: cancelToken.token });
}

export function destroy(id: string, cancelToken: CancelTokenSource): AxiosPromise {
    return api.delete(`job/${id}`, { cancelToken: cancelToken.token });
}

export function jobs(cancelToken: CancelTokenSource): AxiosPromise<Job[]> {
    return api.get('job/all', { cancelToken: cancelToken.token });
}