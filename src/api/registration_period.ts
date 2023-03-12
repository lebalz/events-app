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