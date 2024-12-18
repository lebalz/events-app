import { AxiosPromise } from 'axios';
import api from './base';

export interface Subscription {
    id: string;
    userId: string;
    subscribeToAffected: boolean;
    icsLocator: string;
    untisClassIds: number[];
    departmentIds: string[];
    ignoredEventIds: string[];
    createdAt: string;
    updatedAt: string;
}

export function update(
    id: string,
    data: Partial<Subscription>,
    signal: AbortSignal
): AxiosPromise<Subscription> {
    return api.put(`subscriptions/${id}`, { data }, { signal });
}
