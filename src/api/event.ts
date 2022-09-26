import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import type { User } from './user';

export enum EventState {
    Draft = 'DRAFT',
    Review = 'REVIEW',
    Published = 'PUBLISHED',
    Deleted = 'DELETED',
}
export interface Event {
    id: string;
    authorId: string;
    categories: string[];
    classes: string[];
    description: string;
    descriptionLong: string;
    location: string;
    end: string;
    start: string;
    responsibleIds: string[];
    state: EventState;
    createdAt: string;
    updatedAt: string;
}

export function events(cancelToken: CancelTokenSource): AxiosPromise<Event[]> {
    return api.get('events', { cancelToken: cancelToken.token });
}

export function create(data: Event, cancelToken: CancelTokenSource): AxiosPromise<Event> {
    return api.post('event', { cancelToken: cancelToken.token });
}

export function update(data: Event, cancelToken: CancelTokenSource): AxiosPromise<Event> {
    return api.put('event', { cancelToken: cancelToken.token });
}

export function destroy(event: Event, cancelToken: CancelTokenSource) {
    return api.delete('event', { cancelToken: cancelToken.token });
}
