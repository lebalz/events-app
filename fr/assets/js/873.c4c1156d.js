"use strict";
exports.id = 873;
exports.ids = [873];
exports.modules = {

/***/ 73873:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NestedAppAuthController: () => (/* binding */ NestedAppAuthController)
});

// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/crypto/ICrypto.mjs
var ICrypto = __webpack_require__(42891);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/telemetry/performance/PerformanceEvent.mjs
var PerformanceEvent = __webpack_require__(65104);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/utils/TimeUtils.mjs
var TimeUtils = __webpack_require__(96193);
// EXTERNAL MODULE: ./node_modules/@azure/msal-browser/dist/utils/BrowserConstants.mjs
var BrowserConstants = __webpack_require__(55289);
// EXTERNAL MODULE: ./node_modules/@azure/msal-browser/dist/crypto/CryptoOps.mjs + 5 modules
var CryptoOps = __webpack_require__(66451);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/request/RequestParameterBuilder.mjs
var RequestParameterBuilder = __webpack_require__(38602);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/utils/Constants.mjs
var Constants = __webpack_require__(81140);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/utils/StringUtils.mjs
var StringUtils = __webpack_require__(90013);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/error/ClientAuthError.mjs
var ClientAuthError = __webpack_require__(15741);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/error/ClientAuthErrorCodes.mjs
var ClientAuthErrorCodes = __webpack_require__(92445);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/account/AuthToken.mjs
var AuthToken = __webpack_require__(24664);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/error/ServerError.mjs
var ServerError = __webpack_require__(6051);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/error/InteractionRequiredAuthError.mjs
var InteractionRequiredAuthError = __webpack_require__(74115);
// EXTERNAL MODULE: ./node_modules/@azure/msal-common/dist/error/AuthError.mjs
var AuthError = __webpack_require__(76730);
;// CONCATENATED MODULE: ./node_modules/@azure/msal-browser/dist/naa/BridgeError.mjs
/*! @azure/msal-browser v3.13.0 2024-04-11 */

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
function isBridgeError(error) {
    return error.status !== undefined;
}


//# sourceMappingURL=BridgeError.mjs.map

;// CONCATENATED MODULE: ./node_modules/@azure/msal-browser/dist/naa/BridgeStatusCode.mjs
/*! @azure/msal-browser v3.13.0 2024-04-11 */

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const BridgeStatusCode = {
    UserInteractionRequired: "USER_INTERACTION_REQUIRED",
    UserCancel: "USER_CANCEL",
    NoNetwork: "NO_NETWORK",
    TransientError: "TRANSIENT_ERROR",
    PersistentError: "PERSISTENT_ERROR",
    Disabled: "DISABLED",
    AccountUnavailable: "ACCOUNT_UNAVAILABLE",
    NestedAppAuthUnavailable: "NESTED_APP_AUTH_UNAVAILABLE", // NAA is unavailable in the current context, can retry with standard browser based auth
};


//# sourceMappingURL=BridgeStatusCode.mjs.map

;// CONCATENATED MODULE: ./node_modules/@azure/msal-browser/dist/naa/mapping/NestedAppAuthAdapter.mjs
/*! @azure/msal-browser v3.13.0 2024-04-11 */





/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class NestedAppAuthAdapter {
    constructor(clientId, clientCapabilities, crypto, logger) {
        this.clientId = clientId;
        this.clientCapabilities = clientCapabilities;
        this.crypto = crypto;
        this.logger = logger;
    }
    toNaaTokenRequest(request) {
        let extraParams;
        if (request.extraQueryParameters === undefined) {
            extraParams = new Map();
        }
        else {
            extraParams = new Map(Object.entries(request.extraQueryParameters));
        }
        const requestBuilder = new RequestParameterBuilder/* RequestParameterBuilder */.W();
        const claims = requestBuilder.addClientCapabilitiesToClaims(request.claims, this.clientCapabilities);
        const scopes = request.scopes || Constants/* OIDC_DEFAULT_SCOPES */.aZ;
        const tokenRequest = {
            platformBrokerId: request.account?.homeAccountId,
            clientId: this.clientId,
            authority: request.authority,
            scope: scopes.join(" "),
            correlationId: request.correlationId !== undefined
                ? request.correlationId
                : this.crypto.createNewGuid(),
            claims: !StringUtils/* StringUtils */.$.isEmptyObj(claims) ? claims : undefined,
            state: request.state,
            authenticationScheme: request.authenticationScheme || Constants/* AuthenticationScheme */.IO.BEARER,
            extraParameters: extraParams,
        };
        return tokenRequest;
    }
    fromNaaTokenResponse(request, response, reqTimestamp) {
        if (!response.token.id_token || !response.token.access_token) {
            throw (0,ClientAuthError/* createClientAuthError */.SB)(ClientAuthErrorCodes/* nullOrEmptyToken */.Bh);
        }
        const expiresOn = new Date((reqTimestamp + (response.token.expires_in || 0)) * 1000);
        const idTokenClaims = AuthToken/* extractTokenClaims */.My(response.token.id_token, this.crypto.base64Decode);
        const account = this.fromNaaAccountInfo(response.account, idTokenClaims);
        const scopes = response.token.scope || request.scope;
        const authenticationResult = {
            authority: response.token.authority || account.environment,
            uniqueId: account.localAccountId,
            tenantId: account.tenantId,
            scopes: scopes.split(" "),
            account,
            idToken: response.token.id_token,
            idTokenClaims,
            accessToken: response.token.access_token,
            fromCache: true,
            expiresOn: expiresOn,
            tokenType: request.authenticationScheme || Constants/* AuthenticationScheme */.IO.BEARER,
            correlationId: request.correlationId,
            extExpiresOn: expiresOn,
            state: request.state,
        };
        return authenticationResult;
    }
    /*
     *  export type AccountInfo = {
     *     homeAccountId: string;
     *     environment: string;
     *     tenantId: string;
     *     username: string;
     *     localAccountId: string;
     *     name?: string;
     *     idToken?: string;
     *     idTokenClaims?: TokenClaims & {
     *         [key: string]:
     *             | string
     *             | number
     *             | string[]
     *             | object
     *             | undefined
     *             | unknown;
     *     };
     *     nativeAccountId?: string;
     *     authorityType?: string;
     * };
     */
    fromNaaAccountInfo(fromAccount, idTokenClaims) {
        const effectiveIdTokenClaims = idTokenClaims || fromAccount.idTokenClaims;
        const localAccountId = fromAccount.localAccountId ||
            effectiveIdTokenClaims?.oid ||
            effectiveIdTokenClaims?.sub ||
            "";
        const tenantId = fromAccount.tenantId || effectiveIdTokenClaims?.tid || "";
        const homeAccountId = fromAccount.homeAccountId || `${localAccountId}.${tenantId}`;
        const username = fromAccount.username ||
            effectiveIdTokenClaims?.preferred_username ||
            "";
        const name = fromAccount.name || effectiveIdTokenClaims?.name;
        const account = {
            homeAccountId,
            environment: fromAccount.environment,
            tenantId,
            username,
            localAccountId,
            name,
            idToken: fromAccount.idToken,
            idTokenClaims: effectiveIdTokenClaims,
        };
        return account;
    }
    /**
     *
     * @param error BridgeError
     * @returns AuthError, ClientAuthError, ClientConfigurationError, ServerError, InteractionRequiredError
     */
    fromBridgeError(error) {
        if (isBridgeError(error)) {
            switch (error.status) {
                case BridgeStatusCode.UserCancel:
                    return new ClientAuthError/* ClientAuthError */.eB(ClientAuthErrorCodes/* userCanceled */.fn);
                case BridgeStatusCode.NoNetwork:
                    return new ClientAuthError/* ClientAuthError */.eB(ClientAuthErrorCodes/* noNetworkConnectivity */.l7);
                case BridgeStatusCode.AccountUnavailable:
                    return new ClientAuthError/* ClientAuthError */.eB(ClientAuthErrorCodes/* noAccountFound */.rk);
                case BridgeStatusCode.Disabled:
                    return new ClientAuthError/* ClientAuthError */.eB(ClientAuthErrorCodes/* nestedAppAuthBridgeDisabled */.CN);
                case BridgeStatusCode.NestedAppAuthUnavailable:
                    return new ClientAuthError/* ClientAuthError */.eB(error.code ||
                        ClientAuthErrorCodes/* nestedAppAuthBridgeDisabled */.CN, error.description);
                case BridgeStatusCode.TransientError:
                case BridgeStatusCode.PersistentError:
                    return new ServerError/* ServerError */.g(error.code, error.description);
                case BridgeStatusCode.UserInteractionRequired:
                    return new InteractionRequiredAuthError/* InteractionRequiredAuthError */.CB(error.code, error.description);
                default:
                    return new AuthError/* AuthError */.lR(error.code, error.description);
            }
        }
        else {
            return new AuthError/* AuthError */.lR("unknown_error", "An unknown error occurred");
        }
    }
}


//# sourceMappingURL=NestedAppAuthAdapter.mjs.map

;// CONCATENATED MODULE: ./node_modules/@azure/msal-browser/dist/error/NestedAppAuthError.mjs
/*! @azure/msal-browser v3.13.0 2024-04-11 */



/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * NestedAppAuthErrorMessage class containing string constants used by error codes and messages.
 */
const NestedAppAuthErrorMessage = {
    unsupportedMethod: {
        code: "unsupported_method",
        desc: "The PKCE code challenge and verifier could not be generated.",
    },
};
class NestedAppAuthError extends AuthError/* AuthError */.lR {
    constructor(errorCode, errorMessage) {
        super(errorCode, errorMessage);
        Object.setPrototypeOf(this, NestedAppAuthError.prototype);
        this.name = "NestedAppAuthError";
    }
    static createUnsupportedError() {
        return new NestedAppAuthError(NestedAppAuthErrorMessage.unsupportedMethod.code, NestedAppAuthErrorMessage.unsupportedMethod.desc);
    }
}


//# sourceMappingURL=NestedAppAuthError.mjs.map

// EXTERNAL MODULE: ./node_modules/@azure/msal-browser/dist/event/EventHandler.mjs
var EventHandler = __webpack_require__(28035);
// EXTERNAL MODULE: ./node_modules/@azure/msal-browser/dist/event/EventType.mjs
var EventType = __webpack_require__(12413);
;// CONCATENATED MODULE: ./node_modules/@azure/msal-browser/dist/controllers/NestedAppAuthController.mjs
/*! @azure/msal-browser v3.13.0 2024-04-11 */









/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
class NestedAppAuthController {
    constructor(operatingContext) {
        this.operatingContext = operatingContext;
        const proxy = this.operatingContext.getBridgeProxy();
        if (proxy !== undefined) {
            this.bridgeProxy = proxy;
        }
        else {
            throw new Error("unexpected: bridgeProxy is undefined");
        }
        // Set the configuration.
        this.config = operatingContext.getConfig();
        // Initialize logger
        this.logger = this.operatingContext.getLogger();
        // Initialize performance client
        this.performanceClient = this.config.telemetry.client;
        // Initialize the crypto class.
        this.browserCrypto = operatingContext.isBrowserEnvironment()
            ? new CryptoOps/* CryptoOps */.M(this.logger, this.performanceClient)
            : ICrypto/* DEFAULT_CRYPTO_IMPLEMENTATION */.j;
        this.eventHandler = new EventHandler/* EventHandler */.J(this.logger, this.browserCrypto);
        this.nestedAppAuthAdapter = new NestedAppAuthAdapter(this.config.auth.clientId, this.config.auth.clientCapabilities, this.browserCrypto, this.logger);
    }
    getBrowserStorage() {
        throw NestedAppAuthError.createUnsupportedError();
    }
    getEventHandler() {
        return this.eventHandler;
    }
    static async createController(operatingContext) {
        const controller = new NestedAppAuthController(operatingContext);
        return Promise.resolve(controller);
    }
    initialize() {
        // do nothing not required by this controller
        return Promise.resolve();
    }
    ensureValidRequest(request) {
        if (request?.correlationId) {
            return request;
        }
        return {
            ...request,
            correlationId: this.browserCrypto.createNewGuid(),
        };
    }
    async acquireTokenInteractive(request) {
        const validRequest = this.ensureValidRequest(request);
        this.eventHandler.emitEvent(EventType/* EventType */.B.ACQUIRE_TOKEN_START, BrowserConstants/* InteractionType */.X8.Popup, validRequest);
        const atPopupMeasurement = this.performanceClient.startMeasurement(PerformanceEvent/* PerformanceEvents */.MX.AcquireTokenPopup, validRequest.correlationId);
        atPopupMeasurement?.add({ nestedAppAuthRequest: true });
        try {
            const naaRequest = this.nestedAppAuthAdapter.toNaaTokenRequest(validRequest);
            const reqTimestamp = TimeUtils/* nowSeconds */._C();
            const response = await this.bridgeProxy.getTokenInteractive(naaRequest);
            const result = this.nestedAppAuthAdapter.fromNaaTokenResponse(naaRequest, response, reqTimestamp);
            this.operatingContext.setActiveAccount(result.account);
            this.eventHandler.emitEvent(EventType/* EventType */.B.ACQUIRE_TOKEN_SUCCESS, BrowserConstants/* InteractionType */.X8.Popup, result);
            atPopupMeasurement.add({
                accessTokenSize: result.accessToken.length,
                idTokenSize: result.idToken.length,
            });
            atPopupMeasurement.end({
                success: true,
                requestId: result.requestId,
            });
            return result;
        }
        catch (e) {
            const error = this.nestedAppAuthAdapter.fromBridgeError(e);
            this.eventHandler.emitEvent(EventType/* EventType */.B.ACQUIRE_TOKEN_FAILURE, BrowserConstants/* InteractionType */.X8.Popup, null, e);
            atPopupMeasurement.end({
                success: false,
            }, e);
            throw error;
        }
    }
    async acquireTokenSilentInternal(request) {
        const validRequest = this.ensureValidRequest(request);
        this.eventHandler.emitEvent(EventType/* EventType */.B.ACQUIRE_TOKEN_START, BrowserConstants/* InteractionType */.X8.Silent, validRequest);
        const ssoSilentMeasurement = this.performanceClient.startMeasurement(PerformanceEvent/* PerformanceEvents */.MX.SsoSilent, validRequest.correlationId);
        ssoSilentMeasurement?.increment({
            visibilityChangeCount: 0,
        });
        ssoSilentMeasurement?.add({
            nestedAppAuthRequest: true,
        });
        try {
            const naaRequest = this.nestedAppAuthAdapter.toNaaTokenRequest(validRequest);
            const reqTimestamp = TimeUtils/* nowSeconds */._C();
            const response = await this.bridgeProxy.getTokenSilent(naaRequest);
            const result = this.nestedAppAuthAdapter.fromNaaTokenResponse(naaRequest, response, reqTimestamp);
            this.operatingContext.setActiveAccount(result.account);
            this.eventHandler.emitEvent(EventType/* EventType */.B.ACQUIRE_TOKEN_SUCCESS, BrowserConstants/* InteractionType */.X8.Silent, result);
            ssoSilentMeasurement?.add({
                accessTokenSize: result.accessToken.length,
                idTokenSize: result.idToken.length,
            });
            ssoSilentMeasurement?.end({
                success: true,
                requestId: result.requestId,
            });
            return result;
        }
        catch (e) {
            const error = this.nestedAppAuthAdapter.fromBridgeError(e);
            this.eventHandler.emitEvent(EventType/* EventType */.B.ACQUIRE_TOKEN_FAILURE, BrowserConstants/* InteractionType */.X8.Silent, null, e);
            ssoSilentMeasurement?.end({
                success: false,
            }, e);
            throw error;
        }
    }
    async acquireTokenPopup(request) {
        return this.acquireTokenInteractive(request);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    acquireTokenRedirect(request) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    async acquireTokenSilent(silentRequest) {
        return this.acquireTokenSilentInternal(silentRequest);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    acquireTokenByCode(request // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    acquireTokenNative(request, apiId, // eslint-disable-line @typescript-eslint/no-unused-vars
    accountId // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    acquireTokenByRefreshToken(commonRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
    silentRequest // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    /**
     * Adds event callbacks to array
     * @param callback
     */
    addEventCallback(callback) {
        return this.eventHandler.addEventCallback(callback);
    }
    /**
     * Removes callback with provided id from callback array
     * @param callbackId
     */
    removeEventCallback(callbackId) {
        this.eventHandler.removeEventCallback(callbackId);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addPerformanceCallback(callback) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removePerformanceCallback(callbackId) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    enableAccountStorageEvents() {
        throw NestedAppAuthError.createUnsupportedError();
    }
    disableAccountStorageEvents() {
        throw NestedAppAuthError.createUnsupportedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAccount(accountFilter) {
        throw NestedAppAuthError.createUnsupportedError();
        // TODO: Look at standard implementation
    }
    getAccountByHomeId(homeAccountId) {
        const currentAccount = this.operatingContext.getActiveAccount();
        if (currentAccount !== undefined) {
            if (currentAccount.homeAccountId === homeAccountId) {
                return this.nestedAppAuthAdapter.fromNaaAccountInfo(currentAccount);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    getAccountByLocalId(localId) {
        const currentAccount = this.operatingContext.getActiveAccount();
        if (currentAccount !== undefined) {
            if (currentAccount.localAccountId === localId) {
                return this.nestedAppAuthAdapter.fromNaaAccountInfo(currentAccount);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    getAccountByUsername(userName) {
        const currentAccount = this.operatingContext.getActiveAccount();
        if (currentAccount !== undefined) {
            if (currentAccount.username === userName) {
                return this.nestedAppAuthAdapter.fromNaaAccountInfo(currentAccount);
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    getAllAccounts() {
        const currentAccount = this.operatingContext.getActiveAccount();
        if (currentAccount !== undefined) {
            return [
                this.nestedAppAuthAdapter.fromNaaAccountInfo(currentAccount),
            ];
        }
        else {
            return [];
        }
    }
    handleRedirectPromise(hash // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        return Promise.resolve(null);
    }
    loginPopup(request // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        return this.acquireTokenInteractive(request || BrowserConstants/* DEFAULT_REQUEST */.uq);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginRedirect(request) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    logout(logoutRequest) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    logoutRedirect(logoutRequest // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    logoutPopup(logoutRequest // eslint-disable-line @typescript-eslint/no-unused-vars
    ) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    ssoSilent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request) {
        return this.acquireTokenSilentInternal(request);
    }
    getTokenCache() {
        throw NestedAppAuthError.createUnsupportedError();
    }
    /**
     * Returns the logger instance
     */
    getLogger() {
        return this.logger;
    }
    /**
     * Replaces the default logger set in configurations with new Logger with new configurations
     * @param logger Logger instance
     */
    setLogger(logger) {
        this.logger = logger;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setActiveAccount(account) {
        /*
         * StandardController uses this to allow the developer to set the active account
         * in the nested app auth scenario the active account is controlled by the app hosting the nested app
         */
        this.logger.warning("nestedAppAuth does not support setActiveAccount");
        return;
    }
    getActiveAccount() {
        const currentAccount = this.operatingContext.getActiveAccount();
        if (currentAccount !== undefined) {
            return this.nestedAppAuthAdapter.fromNaaAccountInfo(currentAccount);
        }
        else {
            return null;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initializeWrapperLibrary(sku, version) {
        /*
         * Standard controller uses this to set the sku and version of the wrapper library in the storage
         * we do nothing here
         */
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setNavigationClient(navigationClient) {
        this.logger.warning("setNavigationClient is not supported in nested app auth");
    }
    getConfiguration() {
        return this.config;
    }
    isBrowserEnv() {
        return this.operatingContext.isBrowserEnvironment();
    }
    getBrowserCrypto() {
        return this.browserCrypto;
    }
    getPerformanceClient() {
        throw NestedAppAuthError.createUnsupportedError();
    }
    getRedirectResponse() {
        throw NestedAppAuthError.createUnsupportedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async clearCache(logoutRequest) {
        throw NestedAppAuthError.createUnsupportedError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async hydrateCache(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    result, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request) {
        throw NestedAppAuthError.createUnsupportedError();
    }
}


//# sourceMappingURL=NestedAppAuthController.mjs.map


/***/ })

};
;