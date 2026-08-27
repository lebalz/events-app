import axios from 'axios';
import customFiels from '@site/src/components/utils/customFields';
const { EVENTS_API } = customFiels;
export namespace Api {
    export const BASE_API_URL = eventsApiUrl();

    function eventsApiUrl() {
        return `${EVENTS_API}/api/v1/`;
    }
}

const api = axios.create({
    baseURL: Api.BASE_API_URL,
    withCredentials: true,
    headers: {}
});

export default api;
