import api from './base';
import { AxiosPromise } from 'axios';
import { Subscription } from './subscription';
import { IfmColors } from '../components/shared/Colors';
import { mdiEmailLock, mdiMicrosoft } from '@mdi/js';

export enum Role {
    USER = 'user',
    ADMIN = 'admin'
}
export enum AuthProvider {
    MICROSOFT = 'microsoft',
    CREDENTIAL = 'credential'
}

export const AuthProviderIcons = {
    [AuthProvider.MICROSOFT]: mdiMicrosoft,
    [AuthProvider.CREDENTIAL]: mdiEmailLock
};

export const AuthProviderColor = {
    [AuthProvider.MICROSOFT]: IfmColors.blue,
    [AuthProvider.CREDENTIAL]: IfmColors.info
};

export type User = {
    id: string;
    email: string;
    untisId?: number;
    name: string;
    firstName: string;
    lastName: string;
    notifyOnEventUpdate: boolean;
    notifyAdminOnReviewRequest: boolean;
    notifyAdminOnReviewDecision: boolean;
    role: Role;
    authProviders?: AuthProvider[];
    subscription?: Omit<Subscription, 'userId'>;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
    createdAt: string;
    updatedAt: string;
};

export function currentUser(signal: AbortSignal): AxiosPromise<User> {
    return api.get('/user', { signal });
}

export function logout(signal: AbortSignal): AxiosPromise<void> {
    return api.post('/logout', {}, { signal });
}

export function linkToUntis(userId: string, untisId: number | null, signal: AbortSignal): AxiosPromise<User> {
    return api.put(`users/${userId}/link_to_untis`, { data: { untisId: untisId } }, { signal });
}

export function setRole(userId: string, role: Role, signal: AbortSignal): AxiosPromise<User> {
    return api.put(`users/${userId}/set_role`, { data: { role: role } }, { signal });
}

export function createIcs(userId: string, signal: AbortSignal): AxiosPromise<User> {
    return api.post(`users/${userId}/create_ics`, {}, { signal });
}

export function affectedEventIds(
    userId: string,
    semesterId: string | undefined,
    signal: AbortSignal
): AxiosPromise<string[]> {
    const query = semesterId ? `?semesterId=${semesterId}` : '';
    return api.get(`/users/${userId}/affected-event-ids${query}`, { signal });
}
