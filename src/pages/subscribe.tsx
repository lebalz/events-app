import React from 'react';
import clsx from 'clsx';
import styles from './user.module.scss';
import Layout from '@theme/Layout';
import { useStore } from '../stores/hooks';
import { observer } from 'mobx-react-lite';
import Subscription from '../components/Subscription';
import Section from '../components/shared/Section';
import Translate, { translate } from '@docusaurus/Translate';

const UserPage = observer(() => {
    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <Section
                    title={translate({
                        message: 'Kalender Abonnieren',
                        id: 'abo.section.title.subscribe-calendar',
                        description: 'subscribe to calendars .ics file'
                    })}
                    subtitle={translate({
                        message: 'Abonniere Kalender in einem Kalenderprogramm wie z.B. Outlook',
                        id: 'abo.section.subtitle.subscribe-calendar',
                        description: 'subscribe to calendars .ics file'
                    })}
                >
                    <Translate id="subscribe.instructions.p1">
                        In allen gängigen Kalender-Programmen können Kalender von einer Internetseite
                        abonniert werden, indem die URL zu einer .ics-Datei angegeben wird.
                    </Translate>
                    <br />
                    <Translate id="subscribe.instructions.p2">
                        Unten sind die entsprechenden links aufgeführt und können in den Kalender-Programmen
                        eingefügt werden. Für das Abonnieren mit Outlook kann auf einem Laptop direkt auf den
                        "Abonnieren in Outlook" Knopf geklickt werden oder wie in den verlinkten Anleitungen
                        beschrieben vorgegangen werden.
                    </Translate>
                    <br />
                    <ul>
                        <li>
                            <a href="https://support.microsoft.com/office/import-or-subscribe-to-a-calendar-in-outlook-com-or-outlook-on-the-web-cff1429c-5af6-41ec-a5b4-74f2c278e98c">
                                👉{' '}
                                <Translate id="subscribe.instructions.microsoft">
                                    Anleitung für Outlook
                                </Translate>
                            </a>
                        </li>
                        <li>
                            <a href="https://support.apple.com/guide/calendar/icl1022/mac">
                                👉{' '}
                                <Translate id="subscribe.instructions.apple">
                                    Anleitung für Apple Kalender
                                </Translate>
                            </a>
                        </li>
                    </ul>
                    <Subscription />
                </Section>
            </main>
        </Layout>
    );
});
export default UserPage;
