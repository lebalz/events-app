/*! For license information please see 873.897ea235.js.LICENSE.txt */
"use strict";(self.webpackChunkevents_app=self.webpackChunkevents_app||[]).push([[873],{73873:(e,t,r)=>{r.r(t),r.d(t,{NestedAppAuthController:()=>_});var n=r(42891),o=r(65104),s=r(96193),i=r(55289),c=r(66451),a=r(38602),u=r(81140),d=r(90013),p=r(15741),h=r(92445),l=r(24664),A=r(6051),g=r(74115),E=r(76730);const C="USER_INTERACTION_REQUIRED",m="USER_CANCEL",v="NO_NETWORK",k="TRANSIENT_ERROR",I="PERSISTENT_ERROR",w="DISABLED",T="ACCOUNT_UNAVAILABLE",f="NESTED_APP_AUTH_UNAVAILABLE";class R{constructor(e,t,r,n){this.clientId=e,this.clientCapabilities=t,this.crypto=r,this.logger=n}toNaaTokenRequest(e){let t;t=void 0===e.extraQueryParameters?new Map:new Map(Object.entries(e.extraQueryParameters));const r=(new a.W).addClientCapabilitiesToClaims(e.claims,this.clientCapabilities),n=e.scopes||u.aZ;return{platformBrokerId:e.account?.homeAccountId,clientId:this.clientId,authority:e.authority,scope:n.join(" "),correlationId:void 0!==e.correlationId?e.correlationId:this.crypto.createNewGuid(),claims:d.$.isEmptyObj(r)?void 0:r,state:e.state,authenticationScheme:e.authenticationScheme||u.IO.BEARER,extraParameters:t}}fromNaaTokenResponse(e,t,r){if(!t.token.id_token||!t.token.access_token)throw(0,p.SB)(h.Bh);const n=new Date(1e3*(r+(t.token.expires_in||0))),o=l.My(t.token.id_token,this.crypto.base64Decode),s=this.fromNaaAccountInfo(t.account,o),i=t.token.scope||e.scope;return{authority:t.token.authority||s.environment,uniqueId:s.localAccountId,tenantId:s.tenantId,scopes:i.split(" "),account:s,idToken:t.token.id_token,idTokenClaims:o,accessToken:t.token.access_token,fromCache:!0,expiresOn:n,tokenType:e.authenticationScheme||u.IO.BEARER,correlationId:e.correlationId,extExpiresOn:n,state:e.state}}fromNaaAccountInfo(e,t){const r=t||e.idTokenClaims,n=e.localAccountId||r?.oid||r?.sub||"",o=e.tenantId||r?.tid||"",s=e.homeAccountId||`${n}.${o}`,i=e.username||r?.preferred_username||"",c=e.name||r?.name;return{homeAccountId:s,environment:e.environment,tenantId:o,username:i,localAccountId:n,name:c,idToken:e.idToken,idTokenClaims:r}}fromBridgeError(e){if(!function(e){return void 0!==e.status}(e))return new E.lR("unknown_error","An unknown error occurred");switch(e.status){case m:return new p.eB(h.fn);case v:return new p.eB(h.l7);case T:return new p.eB(h.rk);case w:return new p.eB(h.CN);case f:return new p.eB(e.code||h.CN,e.description);case k:case I:return new A.g(e.code,e.description);case C:return new g.CB(e.code,e.description);default:return new E.lR(e.code,e.description)}}}const y={code:"unsupported_method",desc:"The PKCE code challenge and verifier could not be generated."};class N extends E.lR{constructor(e,t){super(e,t),Object.setPrototypeOf(this,N.prototype),this.name="NestedAppAuthError"}static createUnsupportedError(){return new N(y.code,y.desc)}}var U=r(28035),S=r(12413);class _{constructor(e){this.operatingContext=e;const t=this.operatingContext.getBridgeProxy();if(void 0===t)throw new Error("unexpected: bridgeProxy is undefined");this.bridgeProxy=t,this.config=e.getConfig(),this.logger=this.operatingContext.getLogger(),this.performanceClient=this.config.telemetry.client,this.browserCrypto=e.isBrowserEnvironment()?new c.M(this.logger,this.performanceClient):n.j,this.eventHandler=new U.J(this.logger,this.browserCrypto),this.nestedAppAuthAdapter=new R(this.config.auth.clientId,this.config.auth.clientCapabilities,this.browserCrypto,this.logger)}getBrowserStorage(){throw N.createUnsupportedError()}getEventHandler(){return this.eventHandler}static async createController(e){const t=new _(e);return Promise.resolve(t)}initialize(){return Promise.resolve()}ensureValidRequest(e){return e?.correlationId?e:{...e,correlationId:this.browserCrypto.createNewGuid()}}async acquireTokenInteractive(e){const t=this.ensureValidRequest(e);this.eventHandler.emitEvent(S.B.ACQUIRE_TOKEN_START,i.X8.Popup,t);const r=this.performanceClient.startMeasurement(o.MX.AcquireTokenPopup,t.correlationId);r?.add({nestedAppAuthRequest:!0});try{const e=this.nestedAppAuthAdapter.toNaaTokenRequest(t),n=s._C(),o=await this.bridgeProxy.getTokenInteractive(e),c=this.nestedAppAuthAdapter.fromNaaTokenResponse(e,o,n);return this.operatingContext.setActiveAccount(c.account),this.eventHandler.emitEvent(S.B.ACQUIRE_TOKEN_SUCCESS,i.X8.Popup,c),r.add({accessTokenSize:c.accessToken.length,idTokenSize:c.idToken.length}),r.end({success:!0,requestId:c.requestId}),c}catch(n){const e=this.nestedAppAuthAdapter.fromBridgeError(n);throw this.eventHandler.emitEvent(S.B.ACQUIRE_TOKEN_FAILURE,i.X8.Popup,null,n),r.end({success:!1},n),e}}async acquireTokenSilentInternal(e){const t=this.ensureValidRequest(e);this.eventHandler.emitEvent(S.B.ACQUIRE_TOKEN_START,i.X8.Silent,t);const r=this.performanceClient.startMeasurement(o.MX.SsoSilent,t.correlationId);r?.increment({visibilityChangeCount:0}),r?.add({nestedAppAuthRequest:!0});try{const e=this.nestedAppAuthAdapter.toNaaTokenRequest(t),n=s._C(),o=await this.bridgeProxy.getTokenSilent(e),c=this.nestedAppAuthAdapter.fromNaaTokenResponse(e,o,n);return this.operatingContext.setActiveAccount(c.account),this.eventHandler.emitEvent(S.B.ACQUIRE_TOKEN_SUCCESS,i.X8.Silent,c),r?.add({accessTokenSize:c.accessToken.length,idTokenSize:c.idToken.length}),r?.end({success:!0,requestId:c.requestId}),c}catch(n){const e=this.nestedAppAuthAdapter.fromBridgeError(n);throw this.eventHandler.emitEvent(S.B.ACQUIRE_TOKEN_FAILURE,i.X8.Silent,null,n),r?.end({success:!1},n),e}}async acquireTokenPopup(e){return this.acquireTokenInteractive(e)}acquireTokenRedirect(e){throw N.createUnsupportedError()}async acquireTokenSilent(e){return this.acquireTokenSilentInternal(e)}acquireTokenByCode(e){throw N.createUnsupportedError()}acquireTokenNative(e,t,r){throw N.createUnsupportedError()}acquireTokenByRefreshToken(e,t){throw N.createUnsupportedError()}addEventCallback(e){return this.eventHandler.addEventCallback(e)}removeEventCallback(e){this.eventHandler.removeEventCallback(e)}addPerformanceCallback(e){throw N.createUnsupportedError()}removePerformanceCallback(e){throw N.createUnsupportedError()}enableAccountStorageEvents(){throw N.createUnsupportedError()}disableAccountStorageEvents(){throw N.createUnsupportedError()}getAccount(e){throw N.createUnsupportedError()}getAccountByHomeId(e){const t=this.operatingContext.getActiveAccount();return void 0!==t&&t.homeAccountId===e?this.nestedAppAuthAdapter.fromNaaAccountInfo(t):null}getAccountByLocalId(e){const t=this.operatingContext.getActiveAccount();return void 0!==t&&t.localAccountId===e?this.nestedAppAuthAdapter.fromNaaAccountInfo(t):null}getAccountByUsername(e){const t=this.operatingContext.getActiveAccount();return void 0!==t&&t.username===e?this.nestedAppAuthAdapter.fromNaaAccountInfo(t):null}getAllAccounts(){const e=this.operatingContext.getActiveAccount();return void 0!==e?[this.nestedAppAuthAdapter.fromNaaAccountInfo(e)]:[]}handleRedirectPromise(e){return Promise.resolve(null)}loginPopup(e){return this.acquireTokenInteractive(e||i.uq)}loginRedirect(e){throw N.createUnsupportedError()}logout(e){throw N.createUnsupportedError()}logoutRedirect(e){throw N.createUnsupportedError()}logoutPopup(e){throw N.createUnsupportedError()}ssoSilent(e){return this.acquireTokenSilentInternal(e)}getTokenCache(){throw N.createUnsupportedError()}getLogger(){return this.logger}setLogger(e){this.logger=e}setActiveAccount(e){this.logger.warning("nestedAppAuth does not support setActiveAccount")}getActiveAccount(){const e=this.operatingContext.getActiveAccount();return void 0!==e?this.nestedAppAuthAdapter.fromNaaAccountInfo(e):null}initializeWrapperLibrary(e,t){}setNavigationClient(e){this.logger.warning("setNavigationClient is not supported in nested app auth")}getConfiguration(){return this.config}isBrowserEnv(){return this.operatingContext.isBrowserEnvironment()}getBrowserCrypto(){return this.browserCrypto}getPerformanceClient(){throw N.createUnsupportedError()}getRedirectResponse(){throw N.createUnsupportedError()}async clearCache(e){throw N.createUnsupportedError()}async hydrateCache(e,t){throw N.createUnsupportedError()}}}}]);