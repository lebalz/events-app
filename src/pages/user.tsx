import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import { mdiLogin, mdiRefresh } from '@mdi/js';
import Button from '../components/shared/Button';
import User from '../components/User';
import Section from '../components/shared/Section';
import UsersEvents from '../components/Event/UsersEvents';
import TimeTable from '../components/TimeTable';
import Translate, { translate } from '@docusaurus/Translate';
import Groups from '../components/EventGroup/Groups';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Admonition from '@theme/Admonition';
import customFields from '@site/src/components/utils/customFields';
import PageLayout from '../components/PageLayout';
import Alert from '../components/shared/Alert';
import Loader from '../components/shared/Loader';
const { NO_AUTH } = customFields;

const LoadingPage = () => {
    const loginRoute = useBaseUrl('/login');
    return (
        <PageLayout>
            <Alert type="info">
                <Loader
                    label={translate({
                        message: 'Benutzerinformationen werden geladen...',
                        id: 'user.loading.title'
                    })}
                    align="left"
                    noBadge
                />
            </Alert>
            <Button
                href={loginRoute}
                text={translate({
                    message: 'Zur Anmeldung',
                    id: 'user.loading.login'
                })}
                icon={mdiLogin}
                iconSide="left"
                color="primary"
            />
        </PageLayout>
    );
};

const UserPage = observer(() => {
    const sessionStore = useStore('sessionStore');
    const userStore = useStore('userStore');
    const { isLoggedIn } = sessionStore;
    const { current } = userStore;
    const loginRoute = useBaseUrl('/login');
    if (!NO_AUTH && !isLoggedIn) {
        return <LoadingPage />;
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
                                                window.location.replace(loginRoute);
                                            }, 1);
                                        }}
                                        color="orange"
                                        noOutline
                                    />
                                    <Admonition
                                        type="danger"
                                        title={translate({
                                            message: 'Fehler beim Anmelden.',
                                            id: 'user.error.login'
                                        })}
                                    >
                                        <Translate
                                            id="user.error.login.text"
                                            description="Text for user login error"
                                        >
                                            Aktualisieren Sie die Anmelde-Daten (Klicken Sie auf auf den
                                            orangen Knopf "Aktualisieren"), und melden Sie sich erneut an.
                                            Sollte das Problem weiterhin bestehen, dürfen Sie gerne eine
                                            Fehlermeldung erfassen. Danke ☺️.
                                        </Translate>
                                    </Admonition>
                                </div>
                            )}
                        </TabItem>
                        {current && (
                            <TabItem
                                value="events"
                                label={translate({
                                    message: 'Termine',
                                    id: 'user.tab.events'
                                })}
                            >
                                <UsersEvents user={current} />
                            </TabItem>
                        )}
                        {current && (
                            <TabItem
                                value="groups"
                                label={translate({
                                    message: 'Gruppen',
                                    id: 'user.tab.groups'
                                })}
                            >
                                <Groups />
                            </TabItem>
                        )}
                        {current && (
                            <TabItem
                                value="time-table"
                                label={translate({
                                    message: 'Stundenplan',
                                    id: 'user.tab.time-table'
                                })}
                            >
                                <TimeTable />
                            </TabItem>
                        )}
                    </Tabs>
                </Section>
            </main>
        </Layout>
    );
});
export default UserPage;
