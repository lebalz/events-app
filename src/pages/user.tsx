import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { Redirect, useHistory } from '@docusaurus/router';
import { mdiRefresh } from '@mdi/js';
import Button from '../components/shared/Button';
import User from '../components/User';
import Section from '../components/shared/Section';
import UsersEvents from '../components/Event/UsersEvents';
import TimeTable from '../components/TimeTable';
import { translate } from '@docusaurus/Translate';
import Groups from '../components/EventGroup/Groups';
import { useMsal } from '@azure/msal-react';
import { useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { Loading } from '../components/shared/icons';
import siteConfig from '@generated/docusaurus.config';
import useBaseUrl from '@docusaurus/useBaseUrl';
const { NO_AUTH } = siteConfig.customFields as { TEST_USERNAME?: string; NO_AUTH?: boolean };

const UserPage = observer(() => {
    const sessionStore = useStore('sessionStore');
    const userStore = useStore('userStore');
    const isAuthenticated = useIsAuthenticated();
    const { inProgress } = useMsal();
    const { isStudent, isLoggedIn, currentUserId } = sessionStore;
    const { current } = userStore;
    const loginRoute = useBaseUrl('/login');
    const homeRoute = useBaseUrl('/');
    if (!NO_AUTH && ((currentUserId && !isLoggedIn) || inProgress !== InteractionStatus.None)) {
        return <Loading />;
    }
    if (!NO_AUTH && !(isLoggedIn || isAuthenticated)) {
        return <Redirect to={loginRoute} />;
    }
    if (!NO_AUTH && isStudent) {
        return <Redirect to={homeRoute} />;
    }
    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <Section
                    title={translate({
                        message: 'Persönlicher Bereich',
                        id: 'user.section.title.personal-area',
                        description: 'user.section.title.personal-area'
                    })}
                >
                    <Tabs queryString groupId="user-tab" defaultValue="account" lazy>
                        <TabItem
                            value="account"
                            label={translate({
                                message: 'Account',
                                id: 'user.tab.account'
                            })}
                        >
                            {current ? (
                                <User user={current} />
                            ) : (
                                <div>
                                    <Button
                                        text={translate({
                                            message: 'Aktualisieren',
                                            id: 'user.button.refresh'
                                        })}
                                        icon={mdiRefresh}
                                        iconSide="left"
                                        onClick={() => {
                                            localStorage.clear();
                                            setTimeout(() => {
                                                window.location.replace(useBaseUrl('/login'));
                                            }, 1);
                                        }}
                                        color="orange"
                                        noOutline
                                    />
                                </div>
                            )}
                        </TabItem>
                        <TabItem
                            value="events"
                            label={translate({
                                message: 'Events',
                                id: 'user.tab.events'
                            })}
                        >
                            <UsersEvents user={current} />
                        </TabItem>
                        <TabItem
                            value="groups"
                            label={translate({
                                message: 'Gruppen',
                                id: 'user.tab.groups'
                            })}
                            className="full-width"
                        >
                            <Groups />
                        </TabItem>
                        <TabItem
                            value="time-table"
                            label={translate({
                                message: 'Stundenplan',
                                id: 'user.tab.time-table'
                            })}
                        >
                            <TimeTable />
                        </TabItem>
                    </Tabs>
                </Section>
            </main>
        </Layout>
    );
});
export default UserPage;
