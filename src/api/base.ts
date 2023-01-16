import axios, { CancelTokenSource, CancelToken, AxiosRequestConfig } from 'axios';
import { API, apiConfig, msalInstance, TENANT_ID } from '../authConfig';

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


api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const account = msalInstance.getAllAccounts().find((a) => a.tenantId === TENANT_ID);
    if (account) {
      const accessTokenResponse = await msalInstance.acquireTokenSilent({
        scopes: apiConfig.scopes,
        account: account
      });

      if (accessTokenResponse) {
        const accessToken = accessTokenResponse.accessToken;
        if (config.headers && accessToken) {
          config.headers['Authorization'] = 'Bearer ' + accessToken;
        }
      }
    } else {
      if (config.headers['Authorization']) {
        delete config.headers['Authorization'];
      }
    }
    return config;
  },
  error => {
    Promise.reject(error);
  });


export function createCancelToken(): [CancelTokenSource, CancelToken] {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const token = source.token;

  return [source, token];
}

export function isCancel(throwable: any) {
  return axios.isCancel(throwable);
}

export function isLive(cancelToken: CancelTokenSource) {
  return api.get('', { cancelToken: cancelToken.token });
}

export function checkLogin(cancelToken: CancelTokenSource) {
  return api.get('checklogin', { cancelToken: cancelToken.token });
}

export default api;
