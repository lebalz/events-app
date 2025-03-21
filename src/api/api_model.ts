import { AxiosPromise } from 'axios';
import api from './base';

export function all<T>(endpoint: string, signal: AbortSignal): AxiosPromise<T[]> {
    return api.get(endpoint, { signal });
}

export function create<T>(endpoint: string, data: Partial<T>, signal: AbortSignal): AxiosPromise<T> {
    return api.post(endpoint, data, { signal });
}

export function find<T>(endpoint: string, signal: AbortSignal): AxiosPromise<T> {
    return api.get(endpoint, { signal });
}

export function update<T>(endpoint: string, data: Partial<T>, signal: AbortSignal): AxiosPromise<T> {
    return api.put(endpoint, { data }, { signal });
}

export function destroy<T>(endpoint: string, signal: AbortSignal): AxiosPromise<T> {
    return api.delete(endpoint, { signal });
}
