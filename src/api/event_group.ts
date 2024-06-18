import { AxiosPromise } from 'axios';
import api from './base';
import { Event } from './event';

export interface EventGroup {
    id: string;
    name: string;
    description: string;
    userIds: string[];
    eventIds: string[];
    createdAt: string;
    updatedAt: string;
}

export interface EventGroupCreate extends Partial<EventGroup> {
    event_ids: string[];
}

export function create(data: EventGroupCreate, signal: AbortSignal): AxiosPromise<EventGroup> {
    return api.post('event_groups', data, { signal });
}

export function clone(groupId: string, signal: AbortSignal): AxiosPromise<EventGroup> {
    return api.post(`event_groups/${groupId}/clone`, {}, { signal });
}

export function events<T>(groupId: string, signal: AbortSignal): AxiosPromise<Event[]> {
    return api.get(`event_groups/${groupId}/events`, { signal });
}
