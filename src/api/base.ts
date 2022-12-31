import axios, { CancelTokenSource } from 'axios';
import { API } from '../authConfig';

export namespace Api {
  export const BASE_API_URL = eventsApiUrl();

  function eventsApiUrl() {
    return `${API}/api/v1/`;
  }
}

const api = axios.create({
  baseURL: Api.BASE_API_URL,
  withCredentials: true,
  headers: {}
});

export function isLive(cancelToken: CancelTokenSource) {
  return api.get('', { cancelToken: cancelToken.token });
}

export function checkLogin(cancelToken: CancelTokenSource) {
  return api.get('checklogin', { cancelToken: cancelToken.token });
}

export default api;
