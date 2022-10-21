import api from './base';
import { AxiosPromise, CancelTokenSource } from 'axios';

export enum Role {
    admin = 'ADMIN',
    user = 'USER',
}

export interface User {
    id: string;
    email: string;
    shortName: string;
    firstName: string;
    lastName: string;
    untisId?: number;
    department: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export function user(cancelToken: CancelTokenSource): AxiosPromise<User> {
  return api.get('user', { cancelToken: cancelToken.token });
}
export function users(cancelToken: CancelTokenSource): AxiosPromise<User[]> {
    return api.get('users', { cancelToken: cancelToken.token });
}
