import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.css';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import Icon, { Stack } from '@mdi/react';
import { mdiAccountCircleOutline, mdiAccountGroup, mdiSync, mdiCalendarBlankMultiple, mdiLink, mdiOfficeBuilding, mdiSchool, mdiMicrosoftOutlook, mdiShare, mdiCircle } from '@mdi/js';
import UntisLinker from '../components/User/UntisLinker';
import { Calendar, SIZE, SIZE_S } from '../components/shared/icons';
import { EVENTS_API } from '../authConfig';
import Button from '../components/shared/Button';
import { ApiState } from '../stores/iStore';


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
                                        <Icon path={mdiAccountCircleOutline} size={SIZE} />
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
                                        <Icon path={mdiLink} size={SIZE} />
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
                                        <div>
                                            <Button
                                                href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${userStore.current.icalUrl}&name=GBSL`}
                                                text="Outlook"
                                                title='Regenerate iCal Calendar'
                                                icon={
                                                    <Icon path={mdiMicrosoftOutlook} size={SIZE} />
                                                }
                                                noOutline
                                            />
                                            <Button
                                                onClick={() => userStore.createIcs()}
                                                text="Sync"
                                                icon={<Icon horizontal path={mdiSync} size={SIZE_S} />} 
                                                noOutline
                                                apiState={userStore.apiStateFor('createIcs')}
                                            />
                                            <div className={clsx(styles.ical)}>
                                                {userStore.current.icalUrl && `${EVENTS_API}/ical/${userStore.current.icalUrl}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={clsx('row')}>
                                    <div className={clsx('col', 'col--3', styles.label)}>
                                        <span>Events</span>
                                    </div>
                                    <div className={clsx('col', 'col--1', styles.icon)}>
                                        <Icon path={mdiCalendarBlankMultiple} size={SIZE} />
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
                                                <Icon path={mdiOfficeBuilding} size={SIZE} />
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
                                                <Icon path={mdiAccountGroup} size={SIZE} />
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
                                                <Icon path={mdiSchool} size={SIZE} />
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
