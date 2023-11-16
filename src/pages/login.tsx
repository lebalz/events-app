import React from 'react';
import clsx from 'clsx';
import styles from './login.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.css';
import { useStore } from '../stores/hooks';
import Link from '@docusaurus/Link';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';


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
    const userStore = useStore('userStore');
    const { account, loggedIn } = sessionStore;
    const { current } = userStore;
    if (loggedIn) {
        return (
            <Redirect to={'/user?user-tab=account'} />
        );
    }
    return (
        <Layout>
            <HomepageHeader />
            <main>
                <div className={styles.loginPage}>
                    <Link to="/" onClick={() => sessionStore.login()} className="button button--warning" style={{color: 'black'}}>
                        Login mit GBSL Account
                    </Link>
                </div>
            </main>
        </Layout>
    );
});
export default Login;
