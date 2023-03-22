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
import { mdiAccountCircleOutline, mdiAccountGroup, mdiSync, mdiCalendarBlankMultiple, mdiLink, mdiOfficeBuilding, mdiSchool } from '@mdi/js';
import UntisLinker from '../components/User/UntisLinker';
import { Calendar } from '../components/shared/icons';
import { EVENTS_API } from '../authConfig';
import Button from '../components/shared/Button';


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
    const classes: string[] = [];
    if (current?.untisTeacher) {
        userStore.current.untisTeacher.lessons.forEach(l => {
            const k = l.classes.reduce((curr, k) => {
                if (curr.length === 0) {
                    return k.name;
                } else {
                    return curr + k.letter;
                }
            }, '');
            classes.push(k);
        });
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
                                        <span>Kalender</span>
                                    </div>
                                    <div className={clsx('col', 'col--1', styles.icon)}>
                                        <Calendar />
                                    </div>
                                    <div className={clsx('col', 'col--6', styles.value)}>
                                        <Button onClick={() => userStore.createIcs()} icon={<Icon path={mdiSync} size={1} />} />
                                        {userStore.current.icalUrl && `${EVENTS_API}/ical/${userStore.current.icalUrl}`}
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
                                {
                                    current.untisTeacher && (
                                        <>
                                        <div className={clsx('row')}>
                                            <div className={clsx('col', 'col--3', styles.label)}>
                                                <span>Schulen</span>
                                            </div>
                                            <div className={clsx('col', 'col--1', styles.icon)}>
                                                <Icon path={mdiOfficeBuilding} size={1} />
                                            </div>
                                            <div className={clsx('col', 'col--6', styles.value)}>
                                                {[...new Set(current.untisTeacher.departments.map(d => d.name))].join(', ')}
                                            </div>
                                        </div>
                                        <div className={clsx('row')}>
                                            <div className={clsx('col', 'col--3', styles.label)}>
                                                <span>Klassen</span>
                                            </div>
                                            <div className={clsx('col', 'col--1', styles.icon)}>
                                                <Icon path={mdiAccountGroup} size={1} />
                                            </div>
                                            <div className={clsx('col', 'col--6', styles.value)}>
                                                {[...new Set(classes)].join(', ')}
                                            </div>
                                        </div>
                                        <div className={clsx('row')}>
                                            <div className={clsx('col', 'col--3', styles.label)}>
                                                <span>Fächer</span>
                                            </div>
                                            <div className={clsx('col', 'col--1', styles.icon)}>
                                                <Icon path={mdiSchool} size={1} />
                                            </div>
                                            <div className={clsx('col', 'col--6', styles.value)}>
                                                {[...new Set(current.untisTeacher.lessons.map(l => l.subject))].join(', ')}
                                            </div>
                                        </div>
                                        </>
                                    )
                                }
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
