import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import ICal from '../components/iCal';
import Section from '../components/shared/Section';
import { translate } from '@docusaurus/Translate';

const UserPage = observer(() => {
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
