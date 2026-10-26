import { AxiosPromise } from 'axios';
import api from './base';

export function linkUserPassword(userId: string, userPW: string, signal: AbortSignal): AxiosPromise<void> {
    return api.post(`/admin/users/${userId}/linkUserPassword`, { pw: userPW }, { signal });
}

export function revokeUserPassword(userId: string, signal: AbortSignal): AxiosPromise<void> {
    return api.post(`/admin/users/${userId}/revokeUserPassword`, { signal });
}
