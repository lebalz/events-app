import axios, { InternalAxiosRequestConfig } from 'axios';
import { EVENTS_API, apiConfig, msalInstance, TENANT_ID } from '../authConfig';
import siteConfig from '@generated/docusaurus.config';
import { AccountInfo } from '@azure/msal-browser';
const { TEST_USERNAME } = siteConfig.customFields as { TEST_USERNAME?: string };

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

export const setupAxios = (account?: AccountInfo) => {
    api.interceptors.request.clear();
    if (!account) {
        return;
    }
    api.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            if (process.env.NODE_ENV !== 'production' && TEST_USERNAME) {
                return config;
            }
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
        (error) => {
            Promise.reject(error);
        }
    );
};

const account = msalInstance.getAllAccounts().find((a) => a.tenantId === TENANT_ID);
setupAxios(account);


export function checkLogin(signal: AbortSignal) {
    return api.get('checklogin', { signal });
}

export default api;
