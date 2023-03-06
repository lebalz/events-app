import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface Department {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


export function departments(cancelToken: CancelTokenSource): AxiosPromise<Department[]> {
    return api.get('department/all', { cancelToken: cancelToken.token });
}