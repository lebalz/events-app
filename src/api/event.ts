import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

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
    location: string;
    description: string;
    descriptionLong: string;
    departements: Departements[];
    classes: string[];
    createdAt: string;
    updatedAt: string;
    state: EventState;
}

export function find(id: string, cancelToken: CancelTokenSource): AxiosPromise<Event> {
    return api.get(`event/${id}`, { cancelToken: cancelToken.token });
}
export function events(cancelToken: CancelTokenSource): AxiosPromise<Event[]> {
    return api.get('event/all', { cancelToken: cancelToken.token });
}

export function create(data: Partial<Event>, cancelToken: CancelTokenSource): AxiosPromise<Event> {
    return api.post('event', data, { cancelToken: cancelToken.token });
}

export function update(id: string, data: Event, cancelToken: CancelTokenSource): AxiosPromise<{ updatedAt: string }> {
    return api.put(`event/${id}`, {data: data}, { cancelToken: cancelToken.token });
}

export function destroy(event: Event, cancelToken: CancelTokenSource) {
    return api.delete('event', { cancelToken: cancelToken.token });
}

export function importExcel(formData: FormData) {
    return api.post('event/import', formData);
}
