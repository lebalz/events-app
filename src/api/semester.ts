import { AxiosPromise, CancelTokenSource } from 'axios';
import api from './base';

export interface Semester {
    id: string
    name: string
    start: string
    end: string
    createdAt: string
    updatedAt: string
}