import React from 'react';
import { StoresProvider, rootStore } from '../stores/stores';
import { enableStaticRendering, observer } from 'mobx-react-lite';
import Head from '@docusaurus/Head';
import siteConfig from '@generated/docusaurus.config';
import { useLocation } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { authClient } from '../auth-client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
const { NO_AUTH, TEST_USERNAME, CURRENT_LOCALE, SENTRY_DSN } = siteConfig.customFields as {
    TEST_USERNAME?: string;
    NO_AUTH?: boolean;
    CURRENT_LOCALE?: 'de' | 'fr';
    SENTRY_DSN?: string;
};

if (!ExecutionEnvironment.canUseDOM) {
    enableStaticRendering(true);
    console.log('ℹ️ SSG Mode for MobX Stores enabled.');
}

const ExposeRootStoreToWindow = observer(() => {
    React.useEffect(() => {
        /**
         * Expose the store to the window object
         */
        (window as any).store = rootStore;
    }, [rootStore]);
    return null;
});
const Authentication = observer(() => {
    const { data: session } = authClient.useSession();
    const initialLoad = React.useRef(false);
    React.useEffect(() => {
        if (!rootStore) {
            return;
        }
        if (session?.user) {
            rootStore.load(session.user.id);
        } else if (initialLoad.current) {
            rootStore.cleanup();
        }
    }, [session?.user, rootStore]);
    React.useEffect(() => {
        // load public
        rootStore.load();
    }, []);
    return null;
});

const Sentry = observer(() => {
    React.useEffect(() => {
        import('@sentry/react')
            .then((Sentry) => {
                if (Sentry) {
                    Sentry.init({
                        dsn: SENTRY_DSN
                        // integrations: [Sentry.browserTracingIntegration()],
                        // tracesSampleRate: 1.0, //  Capture 100% of the transactions
                        // tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/]
                    });
                }
            })
            .catch(() => {
                console.error('Sentry failed to load');
            });
    }, [SENTRY_DSN]);
    return null;
});

const LivenessChecker = observer(() => {
    const lastHiddenTimeRef = React.useRef<number | null>(null);
    React.useEffect(() => {
        const handleVisibilityChange = () => {
            if (!rootStore.sessionStore.isLoggedIn) {
                return;
            }
            if (document.hidden) {
                /**
                 * The Browser-Window is now hidden
                 * we could indicate to admins that the user has left the page
                 * (e.g. for exams)
                 */
                lastHiddenTimeRef.current = Date.now();
            } else {
                /**
                 * The Browser-Window is now visible again
                 */
                const elapsedSec = lastHiddenTimeRef.current
                    ? (Date.now() - lastHiddenTimeRef.current) / 1000
                    : 0;
                lastHiddenTimeRef.current = null;
                if (elapsedSec < 5) {
                    return;
                }
                authClient.getSession().then((res) => {
                    if (!res || res.error) {
                        window.location.reload();
                        return;
                    } else {
                        rootStore.socketStore?.checkLiveState();
                    }
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [rootStore]);

    return null;
});

function Root({ children }: { children: React.ReactNode }) {
    const { siteConfig } = useDocusaurusContext();
    const location = useLocation();

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
                <meta
                    property="og:image"
                    content={`${siteConfig.customFields?.APP_URL}/img/og-preview.jpeg`}
                />
            </Head>
            <StoresProvider value={rootStore}>
                <ExposeRootStoreToWindow />
                <Authentication />
                <LivenessChecker />
                {SENTRY_DSN && <Sentry />}
                {children}
            </StoresProvider>
        </>
    );
}

export default Root;
