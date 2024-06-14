import api from './base';
import { AxiosPromise } from 'axios';


export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
};

export type User = {
    id: string
    email: string
    untisId?: number
    firstName: string
    lastName: string
    notifyOnEventUpdate: boolean
    notifyAdminOnReviewRequest: boolean
    notifyAdminOnReviewDecision: boolean
    role: Role
    icsLocator: string | null
    createdAt: string
    updatedAt: string
}

export function currentUser(signal: AbortSignal): AxiosPromise<User> {
    return api.get('/user', { signal });
}

export function logout(signal: AbortSignal): AxiosPromise<void> {
    return api.post('/logout', {}, { signal });
}


export function linkToUntis(userId: string, untisId: number, signal: AbortSignal): AxiosPromise<User> {
    return api.put(
        `users/${userId}/link_to_untis`,
        { data: { untisId: untisId } },
        { signal });
}

export function setRole(userId: string, role: Role, signal: AbortSignal): AxiosPromise<User> {
    return api.put(
        `users/${userId}/set_role`,
        { data: { role: role } },
        { signal });
}



export function createIcs(userId: string, signal: AbortSignal): AxiosPromise<User> {
    return api.post(
        `users/${userId}/create_ics`,
        {},
        { signal });
}


export function affectedEventIds(userId: string, semesterId: string | undefined, signal: AbortSignal): AxiosPromise<string[]> {
    const query = semesterId ? `?semesterId=${semesterId}` : '';
    return api.get(`/users/${userId}/affected-event-ids${query}`, { signal });
}
