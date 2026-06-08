import axios from 'axios';
import { BACKEND_URL } from './config';
export namespace Api {
    export const BASE_API_URL = eventsApiUrl();

    function eventsApiUrl() {
        return `${BACKEND_URL}/api/v1/`;
    }
}

const api = axios.create({
    baseURL: Api.BASE_API_URL,
    withCredentials: true,
    headers: {}
});

export default api;
