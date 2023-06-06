import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.css';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { mdiRefresh } from '@mdi/js';
import Button from '../components/shared/Button';
import User from '../components/User';
import Section from '../components/shared/Section';
import UsersEvents from '../components/Event/UsersEvents';
import TimeTable from '../components/TimeTable';


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
    const { isStudent, loggedIn } = sessionStore;
    const { current } = userStore;
    if (!loggedIn) {
        return (
            <Redirect to={'/login'} />
        );
    }
    if (isStudent) {
        return (
            <Redirect to={'/'} />
        );
    }
    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <Section>
                    <Tabs className={clsx(styles.tabs)} queryString groupId='user-tab'>
                        <TabItem value="account" label="Account" default>
                            <div className={clsx(styles.tab)}>
                                {current && (
                                    <User user={current} />
                                )}
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
                                    className={clsx(styles.logout)}
                                />
                            </div>
                        </TabItem>
                        <TabItem value="events" label="Events">
                            <div className={clsx(styles.tab)}>
                                <UsersEvents user={current} />
                            </div>
                        </TabItem>
                        <TabItem value="time-table" label="Stundenplan">
                            <div className={clsx(styles.tab)}>
                                <TimeTable />
                            </div>
                        </TabItem>
                    </Tabs>
                </Section>
            </main>
        </Layout>
    );
});
export default UserPage;
