import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface Department {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}