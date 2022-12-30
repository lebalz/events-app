import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';
import type { User } from './user';

export enum EventState {
    Draft = 'DRAFT',
    Review = 'REVIEW',
    Published = 'PUBLISHED',
    Deleted = 'DELETED',
}

export enum Departements {
    GYM = 'GYM',
    FMS = 'FMS',
    WMS = 'WMS'
}

export interface Event {
    id: string;
    authorId: string;
    start: string;
    end: string;
    allDay: boolean;
    location:  string;
    description:  string;
    descriptionLong: string;
    departements: Departements[];
    classes: string[];
    createdAt: string;
    updatedAt: string;
    state: EventState;
    onlyKLP: boolean;
    responsibleIds: string[];
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
