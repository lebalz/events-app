import React from 'react';
import clsx from 'clsx';
import styles from './login.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.scss';
import Link from '@docusaurus/Link';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { tokenRequest } from '../authConfig';
import siteConfig from '@generated/docusaurus.config';
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean};


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
    const isAuthenticated = useIsAuthenticated();
    const { instance } = useMsal();
    if (isAuthenticated || NO_AUTH) {
        return (
            <Redirect to={'/user?user-tab=account'} />
        );
    }
    return (
        <Layout>
            <HomepageHeader />
            <main>
                <div className={styles.loginPage}>
                    <Link 
                        to="/" 
                        onClick={() => instance.acquireTokenRedirect(tokenRequest)} 
                        className="button button--warning" 
                        style={{color: 'black'}}
                    >
                        Login mit Schul-Account
                    </Link>
                </div>
            </main>
        </Layout>
    );
});
export default Login;
