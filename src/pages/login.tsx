import React from 'react';
import clsx from 'clsx';
import styles from './login.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.scss';
import Link from '@docusaurus/Link';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { tokenRequest } from '../authConfig';
import siteConfig from '@generated/docusaurus.config';
import { useStore } from '../stores/hooks';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean };

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

const Login = observer(() => {
    const sessionStore = useStore('sessionStore');
    const { instance } = useMsal();
    const isMsalAuthenticated = useIsAuthenticated();
    const isAuthenticated = sessionStore.isLoggedIn || isMsalAuthenticated;
    const homeRoute = useBaseUrl('/user?user-tab=account');
    if (isAuthenticated || NO_AUTH) {
        return <Redirect to={homeRoute} />;
    }
    return (
        <Layout>
            <HomepageHeader />
            <main>
                <div className={clsx(styles.loginPage)}>
                    <Link
                        to="/"
                        onClick={() => instance.acquireTokenRedirect(tokenRequest)}
                        className="button button--warning"
                        style={{ color: 'black' }}
                    >
                        <Translate
                            id="login.button.with.school.account.text"
                            description="the text of the button login with school account"
                        >
                            Login mit Schul-Account
                        </Translate>
                    </Link>
                </div>
            </main>
        </Layout>
    );
});
export default Login;
