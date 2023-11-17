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
import ICal from '../components/iCal';
import Section from '../components/shared/Section';
import UsersEvents from '../components/Event/UsersEvents';
import TimeTable from '../components/TimeTable';
import UserEventGroup from '../components/UserEventGroup';
import { translate } from '@docusaurus/Translate';

const UserPage = observer(() => {
    const userEventGroupStore = useStore('userEventGroupStore');
    const sessionStore = useStore('sessionStore');
    const userStore = useStore('userStore');
    const { loggedIn } = sessionStore;
    const { current } = userStore;
    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <Section 
                    title={translate({
                        message : "Kalender Abonnieren",
                        id:'abo.section.title.subscribe-calendar',
                        description:'subscribe to calendars .ics file'
                    })}
                    subtitle={translate({
                        message : "Abonniere Kalender in einem Kalenderprogramm wie z.B. Outlook",
                        id:'abo.section.subtitle.subscribe-calendar',
                        description:'subscribe to calendars .ics file'
                    })}
                >
                    <ICal />
                </Section>
            </main>
        </Layout>
    );
});
export default UserPage;
