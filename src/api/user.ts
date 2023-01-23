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

export function user(cancelToken: CancelTokenSource): AxiosPromise<User> {
  return api.get('user', { cancelToken: cancelToken.token });
}
export function users(cancelToken: CancelTokenSource): AxiosPromise<User[]> {
    return api.get('user/all', { cancelToken: cancelToken.token });
}
