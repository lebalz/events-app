import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface UserEventGroup {
    id: string
    name: string
    description: string
    userId: string
    createdAt: string
    updatedAt: string
}

export interface UserEventGroupCreate extends Partial<UserEventGroup> {
    event_ids: string[]
}

export function create<T>(data: UserEventGroupCreate, signal: AbortSignal): AxiosPromise<T> {
    return api.post('user_event_group', data, { signal });
}