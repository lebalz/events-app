import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { default as indexStyles } from './index.module.css';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { mdiAccountCircleOutline, mdiAccountGroup, mdiSync, mdiCalendarBlankMultiple, mdiLink, mdiOfficeBuilding, mdiSchool, mdiMicrosoftOutlook, mdiShare, mdiCircle } from '@mdi/js';
import UntisLinker from '../components/User/UntisLinker';
import { Calendar, Icon, SIZE, SIZE_S } from '../components/shared/icons';
import { EVENTS_API } from '../authConfig';
import Button from '../components/shared/Button';
import { ApiState } from '../stores/iStore';
import DefinitionList from '../components/shared/DefinitionList';
import Badge from '../components/shared/Badge';


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
    const iconSide = 'right';
    return (
        <Layout>
            <HomepageHeader />
            <main>
                <div className={styles.container}>
                    <div>
                        {current && (
                            <DefinitionList>
                                <dt><Badge text="Login" icon={<Icon path={mdiAccountCircleOutline}/>} iconSide={iconSide} color='gray'/></dt>
                                <dd>{account.username}</dd>

                                <dt><Badge text="Untis Account" icon={<Icon path={mdiLink}/>} iconSide={iconSide} color='gray'/></dt>
                                <dd><UntisLinker /></dd>

                                <dt><Badge text="Kalender" icon={<Calendar />} iconSide={iconSide} color='gray'/></dt>
                                <dd>
                                    <div>
                                        <div className={clsx(styles.ical)}>
                                            {userStore.current.icalUrl && `${EVENTS_API}/ical/${userStore.current.icalUrl}`}
                                        </div>
                                        <Button
                                            href={`https://outlook.office.com/owa?path=%2Fcalendar%2Faction%2Fcompose&rru=addsubscription&url=${EVENTS_API}/ical/${userStore.current.icalUrl}&name=GBSL`}
                                            text="Outlook"
                                            title='Regenerate iCal Calendar'
                                            icon={
                                                <Icon path={mdiMicrosoftOutlook}  />
                                            }
                                            noOutline
                                        />
                                        <Button
                                            onClick={() => userStore.createIcs()}
                                            text="Sync"
                                            icon={<Icon horizontal path={mdiSync}  />} 
                                            noOutline
                                            apiState={userStore.apiStateFor('createIcs')}
                                        />
                                    </div>
                                </dd>
                                
                                <dt><Badge text="Events" icon={<Icon path={mdiCalendarBlankMultiple}/>} iconSide={iconSide} color='gray'/></dt>
                                <dd>{userStore.currentUsersEvents.length}</dd>

                                {
                                    current.untisTeacher && (
                                        <>
                                        <dt><Badge text="Schulen" icon={<Icon path={mdiOfficeBuilding}/>} iconSide={iconSide} color='gray'/></dt>
                                        <dd>{[...new Set(current.untisTeacher.departments.map(d => d.name))].join(', ')}</dd>
                                            <dt><Badge text="Klassen" icon={<Icon path={mdiAccountGroup}/>} iconSide={iconSide} color='gray'/></dt>
                                            <dd>{[...new Set(classes)].join(', ')}</dd>
                                            <dt><Badge text="Fächer" icon={<Icon path={mdiSchool}/>} iconSide={iconSide} color='gray'/></dt>
                                            <dd>{[...new Set(current.untisTeacher.lessons.map(l => l.subject))].join(', ')}</dd>
                                        </>
                                    )
                                }

                            </DefinitionList>
                        )}
                    </div>



                    <div style={{ height: '3em' }}></div>
                    <Button
                        onClick={() => sessionStore.logout()}
                        text="Logout"
                        className='button--danger'
                        noOutline
                    />
                </div>
            </main>
        </Layout>
    );
});
export default User;
