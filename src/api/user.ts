import api from './base';
import { AxiosPromise, CancelTokenSource } from 'axios';


export enum Role {
    STUDENT = 'STUDENT',
    USER = 'USER',
    ADMIN = 'ADMIN'
};

export type User = {
    id: string
    email: string
    untisId?: number
    firstName: string
    lastName: string
    role: Role
    createdAt: Date
    updatedAt: Date
}

export function linkToUntis(userId: string, untisId: number, signal: AbortSignal): AxiosPromise<User> {
    return api.put(
        `user/${userId}/link_to_untis`,
        { data: { untisId: untisId } },
        { signal });
}



export function createIcs(userId: string, signal: AbortSignal): AxiosPromise<User> {
    return api.post(
        `user/${userId}/create_ics`,
        {},
        { signal });
}

