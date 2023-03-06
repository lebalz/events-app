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