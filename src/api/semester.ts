import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import { Job } from './job';

export interface Semester {
    id: string
    name: string
    start: string
    end: string
    untisSyncDate: string
    createdAt: string
    updatedAt: string
}

export function syncUntis(semesterId: string, signal: AbortSignal): AxiosPromise<Job> {
    return api.post(`semester/${semesterId}/sync_untis` ,  { signal });
}
