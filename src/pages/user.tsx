import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.css';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { mdiRefresh } from '@mdi/js';
import Button from '../components/shared/Button';
import User from '../components/User';


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


const UserPage = observer(() => {
    const sessionStore = useStore('sessionStore');
    const userStore = useStore('userStore');
    const { account, loggedIn } = sessionStore;
    const { current } = userStore;
    if (!loggedIn) {
        return (
            <Redirect to={'/login'} />
        );
    }
    return (
        <Layout>
            <HomepageHeader />
            <main>
                <div className={styles.container}>
                    <div>
                        {current && (
                            <User user={current} />
                        )}
                    </div>



                    <div style={{ height: '3em' }}></div>
                    {
                        !current && (
                            <Button
                                text="Aktualisieren"
                                icon={mdiRefresh}
                                iconSide='left'
                                color="orange"
                                onClick={() => sessionStore.login()}
                            />
                        )
                    }
                    <Button
                        onClick={() => sessionStore.logout()}
                        text="Logout"
                        color='red'
                        noOutline
                    />
                </div>
            </main>
        </Layout>
    );
});
export default UserPage;
