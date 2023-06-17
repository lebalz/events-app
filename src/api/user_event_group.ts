import { AxiosPromise } from 'axios';
import api from './base';
import { Event } from './event';

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

export function create(data: UserEventGroupCreate, signal: AbortSignal): AxiosPromise<UserEventGroup> {
    return api.post('user_event_group', data, { signal });
}

export function clone(groupId: string, signal: AbortSignal): AxiosPromise<UserEventGroup> {
    return api.post(`user_event_group/${groupId}/clone`, {}, { signal });
}

export function events<T>(groupId: string, signal: AbortSignal): AxiosPromise<Event[]> {
    return api.get(`user_event_group/${groupId}/events`, { signal });
}