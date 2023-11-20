import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect } from '@docusaurus/router';
import { mdiRefresh } from '@mdi/js';
import Button from '../components/shared/Button';
import User from '../components/User';
import Section from '../components/shared/Section';
import UsersEvents from '../components/Event/UsersEvents';
import TimeTable from '../components/TimeTable';
import UserEventGroup from '../components/UserEventGroup';
import { translate } from '@docusaurus/Translate';

const UserPage = observer(() => {
    const userEventGroupStore = useStore('userEventGroupStore');
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
                <Section title={translate({
                    message : "Persönlicher Bereich",
                    id:'user.section.title.personal-area' ,
                    description:'user.section.title.personal-area'})}>
                    <Tabs className={clsx(styles.tabs)} queryString groupId='user-tab' defaultValue='account' lazy>
                        <TabItem 
                            value="account" 
                            label={translate({
                                message: 'Account',
                                id: 'user.tab.account'
                            })}
                            default
                        >
                            <div className={clsx(styles.tab)}>
                                {current && (
                                    <User user={current} />
                                )}
                                <div style={{ height: '3em' }}></div>
                                {
                                    !current && (
                                        <Button
                                            text={translate({
                                                message : "Aktualisieren",
                                                id:'user.button.refresh.text' ,
                                                description:'user.button.refresh.text'})}
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
                        <TabItem 
                            value="events" 
                            label={translate({
                                message: 'Events',
                                id: 'user.tab.events'
                            })}
                        >
                            <div className={clsx(styles.tab)}>
                                <UsersEvents user={current} />
                            </div>
                        </TabItem>
                        <TabItem 
                            value="groups" 
                            label={translate({
                                message: 'Gruppen',
                                id: 'user.tab.groups'
                            })}
                        >
                            <div className={clsx(styles.tab)}>
                                <div className={clsx(styles.groups)}>
                                    {
                                        userEventGroupStore.userEventGroups.map((group) => {
                                            return (
                                                <UserEventGroup group={group} key={group.id}/>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </TabItem>
                        <TabItem 
                            value="time-table" 
                            label={translate({
                                message: 'Stundenplan',
                                id: 'user.tab.time-table'
                            })}
                        >
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
