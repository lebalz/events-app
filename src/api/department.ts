import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface Department {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


export function departments(signal: AbortSignal): AxiosPromise<Department[]> {
    return api.get('department/all', { signal });
}

export function create(data: Partial<Department>, signal: AbortSignal): AxiosPromise<Department> {
    return api.post('department', data, { signal });
}

export function find(id: string, signal: AbortSignal): AxiosPromise<Department> {
    return api.get(`department/${id}`, { signal });
}

export function update(id: string, data: Partial<Department>, signal: AbortSignal): AxiosPromise<Department> {
    return api.put(`department/${id}`, { data }, { signal });
}

export function destroy(id: string, signal: AbortSignal): AxiosPromise<void> {
    return api.delete(`department/${id}`, { signal });
}

