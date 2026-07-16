import React from 'react';
import clsx from 'clsx';
import styles from './login.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { authClient } from '@site/src/auth-client';
import { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { mdiMicrosoft } from '@mdi/js';
import Button from '../components/shared/Button';
import customFields from '@site/src/components/shared/customFields';
const { NO_AUTH, DOMAIN } = customFields;

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
    const homeRoute = useBaseUrl('/user?user-tab=account');
    if (session?.user || NO_AUTH) {
        return <Redirect to={rootUrl} />;
    }
    return (
        <Layout>
            <HomepageHeader />
            <main>
                <div className={clsx(styles.loginPage)}>
                    <Button
                        onClick={() =>
                            authClient.signIn.social({
                                provider: 'microsoft',
                                callbackURL: DOMAIN
                            })
                        }
                        text={translate({
                            id: 'login.button.with_school_account.text',
                            message: 'Login mit Schul-Account',
                            description: 'the text of the button login with school account'
                        })}
                        icon={mdiMicrosoft}
                        iconSide="left"
                        color="blue"
                        size={1.5}
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
