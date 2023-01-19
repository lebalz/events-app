/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel, PublicClientApplication } from "@azure/msal-browser";
import siteConfig from '@generated/docusaurus.config';

export interface CustomFields {
  DOMAIN: string;
  EVENTS_API: string;
  CLIENT_ID: string;
  TENANT_ID: string;
  API_URI: string;
}

/** The Domain Name of this app */
export const {EVENTS_API, CLIENT_ID, DOMAIN, TENANT_ID, API_URI} = siteConfig.customFields as any as CustomFields;

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: DOMAIN,
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            if (process.env.NODE_ENV !== 'debug') {
              return
            }
            console.info(message);
            return;
          case LogLevel.Verbose:
            if (process.env.NODE_ENV !== 'debug') {
              return
            }
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const scopes = [`${API_URI}/access_as_user`];

// Add here the endpoints and scopes for the web API you would like to use.
export const apiConfig = {
  uri: API_URI,
  scopes: scopes,
};
/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: scopes,
};

/**
 * Scopes you add here will be used to request a token from Azure AD to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
  scopes: [...apiConfig.scopes],
};

export const msalInstance = new PublicClientApplication(msalConfig);
