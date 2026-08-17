import React from 'react';
import clsx from 'clsx';
import styles from './login.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { authClient } from '@site/src/auth-client';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { mdiLoading, mdiMicrosoft } from '@mdi/js';
import Button from '../components/shared/Button';
import customFields from '@site/src/components/utils/customFields';
import { useStore } from '../stores/hooks';
import Alert from '../components/shared/Alert';
const { NO_AUTH, APP_URL } = customFields;

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', indexStyles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
            </div>
        </header>
    );
}

const LoginPage = observer(() => {
    const { data: session } = authClient.useSession();
    const rootUrl = useBaseUrl('/');
    const authStore = useStore('authStore');
    if (session?.user || NO_AUTH) {
        return <Redirect to={rootUrl} />;
    }
    return (
        <Layout>
            <HomepageHeader />
            <main className={clsx(styles.main)}>
                <Alert type="info" className={clsx(styles.alert)}>
                    <Translate id="login.info.text">
                        Nur Lehrkräfte und Administrationsmitglieder der Schule können sich mit ihrem
                        Schul-Account anmelden.
                    </Translate>
                </Alert>
                {authStore.authErrorMessage && (
                    <Alert
                        type="danger"
                        className={clsx(styles.authErrorMessage)}
                        onDiscard={() => authStore.setAuthErrorMessage(null)}
                    >
                        {authStore.authErrorMessage}
                    </Alert>
                )}
                <div className={clsx(styles.loginPage)}>
                    <Button
                        noTransform
                        onClick={() => authStore.socialSignIn('microsoft')}
                        text={translate({
                            id: 'login.button.with_school_account.text',
                            message: 'Login mit Schul-Account',
                            description: 'the text of the button login with school account'
                        })}
                        icon={authStore.isAuthenticating === 'microsoft' ? mdiLoading : mdiMicrosoft}
                        spin={authStore.isAuthenticating === 'microsoft'}
                        iconSide="left"
                        color="blue"
                        size={2}
                        className={clsx(styles.mainLoginMethod)}
                    />
                </div>
            </main>
        </Layout>
    );
});

const Login = observer(() => {
    const { data: session } = authClient.useSession();
    const rootUrl = useBaseUrl('/');

    if (session?.user || NO_AUTH) {
        return <Redirect to={rootUrl} />;
    }
    return <LoginPage />;
});
export default Login;
