import React from 'react';
import { MsalProvider, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { StoresProvider, rootStore } from '../stores/stores';
import { observer } from 'mobx-react-lite';
import { TENANT_ID, msalConfig } from '../authConfig';
import Head from '@docusaurus/Head';
import siteConfig from '@generated/docusaurus.config';
import { useLocation } from '@docusaurus/router';
import { AccountInfo, EventType, InteractionStatus, PublicClientApplication } from '@azure/msal-browser';
import { setupMsalAxios, setupDefaultAxios } from '../api/base';
import { useStore } from '../stores/hooks';
import { action, runInAction } from 'mobx';
const { NO_AUTH, TEST_USERNAME, CURRENT_LOCALE } = siteConfig.customFields as {
    TEST_USERNAME?: string;
    NO_AUTH?: boolean;
    CURRENT_LOCALE?: 'de' | 'fr';
};

export const msalInstance = new PublicClientApplication({
    ...msalConfig,
    auth: {
        ...msalConfig.auth,
        postLogoutRedirectUri:
            CURRENT_LOCALE === 'fr' ? `${siteConfig.url}/fr` : msalConfig.auth.postLogoutRedirectUri
    }
});

if (NO_AUTH) {
    const n = TEST_USERNAME.length >= 40 ? 0 : 40 - TEST_USERNAME.length;
    console.log(
        [
            '',
            '┌──────────────────────────────────────────────────────────┐',
            '│                                                          │',
            '│   _   _                       _   _                      │',
            '│  | \\ | |           /\\        | | | |                     │',
            '│  |  \\| | ___      /  \\  _   _| |_| |__                   │',
            "│  | . ` |/ _ \\    / /\\ \\| | | | __| '_ \\                  │",
            '│  | |\\  | (_) |  / ____ \\ |_| | |_| | | |                 │',
            '│  |_| \\_|\\___/  /_/    \\_\\__,_|\\__|_| |_|                 │',
            '│                                                          │',
            '│                                                          │',
            `│   TEST_USERNAME: ${TEST_USERNAME + ' '.repeat(n)}│`,
            '│                                                          │',
            '│   --> enable authentication by removing "TEST_USERNAME"  │',
            '│       from the environment (or the .env file)            │',
            '└──────────────────────────────────────────────────────────┘'
        ].join('\n')
    );
}

const MsalWrapper = observer(({ children }: { children: React.ReactNode }) => {
    const sessionStore = useStore('sessionStore');
    React.useEffect(() => {
        /**
         * DEV MODE
         * - no auth
         */
        if (NO_AUTH && !sessionStore?.isLoggedIn) {
            setTimeout(() => {
                runInAction(() => {
                    sessionStore.authMethod = 'msal';
                });
                rootStore.sessionStore.setAccount({ username: TEST_USERNAME } as any);
                rootStore.load('authorized');
            }, 1000);
            return;
        }

        if (!sessionStore?.initialized) {
            return;
        }
        /**
         * PROD MODE
         * - auth over cookie
         */
        if (sessionStore.authMethod === 'apiKey') {
            return;
        }

        /**
         * PROD MODE
         * - auth over msal
         */
        msalInstance.initialize().then(() => {
            if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
                // Account selection logic is app dependent. Adjust as needed for different use cases.
                const account = msalInstance
                    .getAllAccounts()
                    .filter((a) => a.tenantId === TENANT_ID)
                    .find((a) => /@(edu\.)?(gbsl|gbjb)\.ch/.test(a.username));
                if (account) {
                    msalInstance.setActiveAccount(account);
                }
            }
            msalInstance.enableAccountStorageEvents();
            msalInstance.addEventCallback((event) => {
                if (
                    event.eventType === EventType.LOGIN_SUCCESS &&
                    (event.payload as { account: AccountInfo }).account
                ) {
                    const account = (event.payload as { account: AccountInfo }).account;
                    msalInstance.setActiveAccount(account);
                }
            });
        });
    }, [msalInstance, sessionStore?.authMethod]);

    React.useEffect(() => {
        if (NO_AUTH) {
            if (!rootStore._isLoadingPublic) {
                rootStore.load('public');
            }
            if (!rootStore._isLoadingPrivate) {
                rootStore.load('authorized');
            }
        }
    }, [NO_AUTH, rootStore]);

    if (NO_AUTH) {
        return children;
    }
    return (
        <MsalProvider instance={msalInstance}>
            <MsalAccount />
            {children}
        </MsalProvider>
    );
});

const MsalAccount = observer(() => {
    const { accounts, inProgress, instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const sessionStore = useStore('sessionStore');

    React.useEffect(() => {
        if (sessionStore.authMethod === 'apiKey' && !NO_AUTH) {
            return;
        }
        if (isAuthenticated && inProgress === InteractionStatus.None) {
            const active = instance.getActiveAccount();
            if (active) {
                /**
                 * order matters
                 * 1. setup axios with the correct tokens
                 * 2. set the msal instance and account to the session store
                 * 3. load authorized entities
                 */
                setupMsalAxios();
                setTimeout(() => {
                    rootStore.sessionStore.setAccount(active);
                    rootStore.load('authorized');
                }, 0);
            }
        }
    }, [sessionStore?.authMethod, accounts, inProgress, instance, isAuthenticated]);
    return (
        <div
            data--isauthenticated={isAuthenticated}
            data--account={instance.getActiveAccount()?.username}
        ></div>
    );
});

// Default implementation, that you can customize
function Root({ children }) {
    const location = useLocation();
    React.useEffect(() => {
        if (!rootStore) {
            return;
        }
        rootStore.sessionStore.setupStorageSync();
        if (window) {
            (window as any).store = rootStore;
        }
        return () => {
            rootStore?.cleanup();
        };
    }, [rootStore]);

    React.useEffect(() => {
        const modalId = rootStore?.viewStore?.openEventModalId;
        /** ensure no modal is open when changing the routes */
        if (modalId) {
            rootStore.viewStore.setEventModalId();
        }
    }, [location, rootStore?.viewStore]);

    return (
        <>
            <Head>
                <meta property="og:description" content={siteConfig.tagline} />
                <meta property="og:image" content={`${siteConfig.customFields.DOMAIN}/img/og-preview.jpeg`} />
            </Head>
            <StoresProvider value={rootStore}>
                <MsalWrapper>{children}</MsalWrapper>
            </StoresProvider>
        </>
    );
}

export default Root;
