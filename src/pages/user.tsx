import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.css';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import Icon from '@mdi/react';
import { mdiAccount, mdiAccountBadge, mdiAccountCircle, mdiAccountCircleOutline, mdiCalendarBlankMultiple, mdiLink, mdiLinkOff } from '@mdi/js';
import UntisLinker from '../components/User/UntisLinker';


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


const User = observer(() => {
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
                    {
                        current && (
                            <div className={clsx('container')}>
                                <div className={clsx('row')}>
                                    <div className={clsx('col', 'col--3', styles.label)}>
                                        <span>Login</span>
                                    </div>
                                    <div className={clsx('col', 'col--1', styles.icon)}>
                                        <Icon path={mdiAccountCircleOutline} size={1} />
                                    </div>
                                    <div className={clsx('col', 'col--6', styles.value)}>
                                        {account.username}
                                    </div>
                                </div>
                                <div className={clsx('row')}>
                                    <div className={clsx('col', 'col--3', styles.label)}>
                                        <span>Untis Account</span>
                                    </div>
                                    <div className={clsx('col', 'col--1', styles.icon)}>
                                        <Icon path={mdiLink} size={1} />
                                    </div>
                                    <div className={clsx('col', 'col--6', styles.value)}>
                                        <UntisLinker />
                                    </div>
                                </div>
                                <div className={clsx('row')}>
                                    <div className={clsx('col', 'col--3', styles.label)}>
                                        <span>Events</span>
                                    </div>
                                    <div className={clsx('col', 'col--1', styles.icon)}>
                                        <Icon path={mdiCalendarBlankMultiple} size={1} />
                                    </div>
                                    <div className={clsx('col', 'col--6', styles.value)}>
                                        {userStore.currentUsersEvents.length}
                                    </div>
                                </div>
                            </div>
                        )
                    }



                    <div style={{ height: '3em' }}></div>
                    <button className="button button--danger" style={{ color: 'black' }} onClick={() => sessionStore.logout()}>
                        Logout
                    </button>
                </div>
            </main>
        </Layout>
    );
});
export default User;
