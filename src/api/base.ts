import axios, { InternalAxiosRequestConfig } from 'axios';
import { EVENTS_API, apiConfig, TENANT_ID } from '../authConfig';
import siteConfig from '@generated/docusaurus.config';
import { InteractionRequiredAuthError, PublicClientApplication } from '@azure/msal-browser';
import { msalInstance } from '../theme/Root';
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

export const setupAxios = () => {
    /** clear all current interceptors and set them up... */
    api.interceptors.request.clear();
    api.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            if (process.env.NODE_ENV !== 'production' && TEST_USERNAME) {
                return config;
            }
            // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
            // --> @see src/theme/Root.tsx
            const activeAccount = msalInstance.getActiveAccount();
            if (activeAccount) {
                try {
                    const accessTokenResponse = await msalInstance.acquireTokenSilent({
                        scopes: apiConfig.scopes,
                        account: activeAccount
                    });
                    const accessToken = accessTokenResponse.accessToken;
                    if (config.headers && accessToken) {
                        config.headers['Authorization'] = 'Bearer ' + accessToken;
                    }
                } catch (e) {
                    delete config.headers['Authorization'];
                    if (e instanceof InteractionRequiredAuthError) {
                        // If there are no cached tokens, or the cached tokens are expired, then the user will need to interact 
                        // with the page to get a new token.
                        console.log('User interaction required to get a new token.', e);
                        // hacky way to get the user to log in again - only happens on firefox when
                        // the default "no 3dparty cookies" setting is active
                        const msalKeys = Object.keys(localStorage).filter((k) => k.startsWith('msal.'));
                        msalKeys.forEach((k) => localStorage.removeItem(k));
                        // proceed with the login
                        await msalInstance.acquireTokenRedirect({
                            scopes: apiConfig.scopes,
                            account: activeAccount
                        });
                    }
                }
            } else {
                /*
                * User is not signed in. Throw error or wait for user to login.
                * Do not attempt to log a user in outside of the context of MsalProvider
                */
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


export const checkLogin = (signal: AbortSignal) => {
    return api.get('checklogin', { signal });
}

export default api;
