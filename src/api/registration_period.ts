import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface RegistrationPeriod {
    id: string
    name: string
    start: string
    end: string
    createdAt: string
    updatedAt: string
}


export function registration_periods(cancelToken: CancelTokenSource): AxiosPromise<RegistrationPeriod[]> {
    return api.get('registration_period/all', { cancelToken: cancelToken.token });
}


export function create(data: Partial<RegistrationPeriod>, cancelToken: CancelTokenSource): AxiosPromise<RegistrationPeriod> {
    return api.post('registration_period', data, { cancelToken: cancelToken.token });
}

export function find(id: string, cancelToken: CancelTokenSource): AxiosPromise<RegistrationPeriod> {
    return api.get(`registration_period/${id}`, { cancelToken: cancelToken.token });
}

export function update(id: string, delta: Partial<RegistrationPeriod>, cancelToken: CancelTokenSource): AxiosPromise<RegistrationPeriod> {
    return api.patch(`registration_period/${id}`, { data: delta }, { cancelToken: cancelToken.token });
}

export function destroy(id: string, cancelToken: CancelTokenSource): AxiosPromise<void> {
    return api.delete(`registration_period/${id}`, { cancelToken: cancelToken.token });
}
