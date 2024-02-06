import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Section from '../components/shared/Section';
import { translate } from '@docusaurus/Translate';
import Icon from '@mdi/react';
import { mdiAccountCircleOutline, mdiCalendarAccount, mdiCalendarMonth, mdiChartTimeline, mdiMicrosoftOutlook, mdiSecurity, mdiViewList } from '@mdi/js';
import Link from '@docusaurus/Link';
import { useStore } from '../stores/hooks';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                {/* <img src='/img/events.png' /> */}
            </div>
        </header>
    );
}

interface NavProps {
    icon: string;
    to: string;
    label: string;
    displayFor: 'public' | 'admin' | 'user';
}
const NavCard = observer((props: NavProps) => {
    const userStore = useStore('userStore');
    if (props.displayFor === 'admin' && !userStore.current?.isAdmin) {
        return null;
    }
    if (props.displayFor === 'user' && !userStore.current) {
        return null;
    }
    return (
        <Link to={props.to} className={clsx('card', styles.navCard)}>
            <div className={clsx('card__image', styles.navCardIcon)}>
                <Icon path={props.icon} size={3} color={'var(--ifm-color-primary)'} />
            </div>
            <div className={clsx('card__footer', styles.navCardBody)}>
                <button className={clsx('button', 'button--primary', 'button--block')}>
                    {props.label}
                </button>
            </div>
        </Link>
    )
});

const Home = observer(() => {
    const { i18n } = useDocusaurusContext();
    const ref = React.useRef<HTMLVideoElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = 0.5;
        }
    }, [ref]);
    return (
        <Layout
            title="Events"
            description="Events Application">
            <HomepageHeader />
            <main>
                <Section className={clsx(styles.navCardSection)}>
                    <div className={clsx(styles.navCards)}>
                        <NavCard
                            icon={mdiViewList}
                            to={useBaseUrl('/table')}
                            label={translate({ message: 'Tabelle', id: 'navcard.table.text', description: 'Button text for navigating to the table page' })}
                            displayFor='public'
                        />
                        <NavCard
                            icon={mdiCalendarMonth}
                            to={useBaseUrl('/calendar')}
                            label={translate({ message: 'Kalender', id: 'navcard.calendar.text', description: 'Button text for navigating to the calendar page' })}
                            displayFor='public'
                        />
                        <NavCard
                            icon={'M 2 2 H 4 V 20 H 22 V 22 H 2 V 2 M 7 10 H 17 V 13 H 7 V 10 M 11 15 H 21 V 18 H 11 V 15 M 6 5 H 21 V 8 H 6 Z'}
                            to={useBaseUrl('/gantt')}
                            label={translate({ message: 'Zeitachse', id: 'navcard.gantt.text', description: 'Button text for navigating to the gantt page' })}
                            displayFor='public'
                        />
                        <NavCard
                            icon={mdiMicrosoftOutlook}
                            to={useBaseUrl('/subscribe')}
                            label={translate({ message: 'Outlook', id: 'navcard.subscribe.text', description: 'Button text for navigating to the subscribe page' })}
                            displayFor='public'
                        />
                        <NavCard
                            icon={mdiAccountCircleOutline}
                            to={useBaseUrl('/user?user-tab=account')}
                            label={translate({ message: 'Account', id: 'navcard.user.account', description: 'Button text for navigating to the user account page' })}
                            displayFor='user'
                        />
                        <NavCard
                            icon={mdiCalendarAccount}
                            to={useBaseUrl('/user?user-tab=events')}
                            label={translate({ message: 'Meine Events', id: 'navcard.user.events', description: 'Button text for navigating to the users events page' })}
                            displayFor='user'
                        />
                        <NavCard
                            icon={mdiSecurity}
                            to={useBaseUrl('/admin')}
                            label={translate({ message: 'Admin', id: 'navcard.admin.text', description: 'Button text for navigating to the admin page' })}
                            displayFor='admin'
                        />
                    </div>
                </Section>
                <Section>
                    {i18n?.currentLocale === 'de' ? (
                        <div className="card" style={{ boxShadow: 'var(--ifm-global-shadow-md)' }}>
                            <div className="card__header">
                                <h2>
                                    Beta-Phase
                                </h2>
                            </div>
                            <div className='card__body'>
                                Der Terminkalender ist noch in der Beta-Phase, was folgende Einschränkungen mit sich bringt:
                                <ul>
                                    <li><b>Erfasste Termine werden aktuell noch nicht in den Terminplan aufgenommen!</b></li>
                                    <li>Die Datenbank muss allenfalls während der Beta-Phase aktualisiert werden - sind selbst erfasste Termine betroffen, werden Sie informiert.</li>
                                    <li>Die URL der abonnierten Kalender könnte sich während der Beta-Phase ändern. Dann würden Sie informiert und müssten den Kalender erneut abonnieren.</li>
                                </ul>
                                Feedback kann über ein Bug-Tracking gemäss untenstehendem Video erfasst werden.
                                <h3>
                                    Vielen Dank für die Mithilfe!
                                </h3>
                            </div>
                            <div className='card__body'>
                                <video 
                                    autoPlay 
                                    controls 
                                    muted
                                    loop 
                                    id="myVideo"
                                    ref={ref}
                                    style={{ width: '100%', height: '100%', maxHeight: '1200px' }}
                                >
                                    <source src={useBaseUrl("/img/events-ruttl-de.mp4")} type="video/mp4" />
                                </video>
                            </div>
                            <div className='card__body'>
                                <h3>Changelog</h3>
                                <h4>Version: Beta 1.5 (6.02.2024)</h4>
                                <ul>
                                    <li>Fix: Firefox spielt Video ab</li>
                                    <li>Fix: Login sollte nun auf allen Browsern funktionieren und die Account-Daten werden auch nach dem ersten Login geladen.</li>
                                    <li>Bestätigung für das Löschen eines Events ist nun ein Popup.</li>
                                </ul>
                                <h4>Version: Beta 1.4 (22.01.2024)</h4>
                                <ul>
                                    <li>Eingabe: Option für die Eingabe von ganztägigen Terminen hinzugefügt.</li>
                                    <li>Fix: Verbesserung des UI's wenn die Mehrfaktor-Authentifizierung notwendig ist.</li>
                                    <li>Zeitachse: Titelleiste ist beim Scrollen oben am Fenster fixiert.</li>
                                </ul>
                                <h4>Version: Beta 1.3 (15.01.2024)</h4>
                                <ul>
                                    <li>Inkrementelles Laden: Es werden die öffentlichen Termine geladen, <b>während</b> die Benutzer:in eingeloggt wird. Sobald die Anmeldeinformationen vorhanden sind, werden auch die persönlichen Daten geladen. Führt zu einem schnelleren Laden der Seite.  <a href="https://github.com/lebalz/events-app/pull/17"></a></li>
                                    <li>Logout Button ist nun im sichtbaren Bereich auf der <a href="/user?user-tab=account">User-Seite</a></li>
                                    <li>Fix: Abonnierbare Kalender sind korrekt beschriftet</li>
                                    <li>Fix: Kalenderwochen werden auch beim Jahreswechsel korrekt sortiert</li>
                                </ul>
                                <h4>Version: Beta 1.2 (07.01.2024)</h4>
                                <ul>
                                    <li>Termin-Filter: Wer EF Unterrichtet, wurde bisher automatisch auch dem GBJB zugeteilt (bei EF's werden alle Gym-Klassen zugeteilt, also auch Nicht-Bilingue Klassen des GBJB, so dass bisher eine Zugehörigkeit zum GBJB abgeleitet wurde). Für das EF bzw. OC ist dieser Fehler behoben. Falls bei anderen Fächern ebenfalls Schulübergreifend Klassen zugeordnet werden, gerne melden. <a href="https://github.com/lebalz/events-api/pull/9" target="_blank">PR: Bilingue flag and relations for events</a></li>
                                    <li>Beim Erfassen von Terminen für Bilingua-Klassen, welche nur <i>LP</i> oder <i>ALLE</i> betreffen, kann nun angegeben werden, ob Lehrpersonen der abderen Schule auch betroffen sind (bspw. bei 26Gn das GBJB oder bei 26mT das GBSL) </li>
                                    <li>Admin-Bereich: Bilingue-Departemente können nun den zugehörigen Schulen zugewiesen werden</li>
                                    <li>Admin-Bereich: GBJB Import von CSV Dateien <a href="https://github.com/lebalz/events-api/pull/8">PR: Create import service for gbjb csv files</a></li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ boxShadow: 'var(--ifm-global-shadow-md)' }}>
                            <div className='card__footer'>
                                <video 
                                    autoPlay 
                                    controls 
                                    muted
                                    loop 
                                    id="myVideo"
                                    ref={ref}
                                    style={{ width: '100%', height: '100%', maxHeight: '1200px' }}
                                >
                                    <source src={useBaseUrl("/img/events-ruttl-de.mp4")} type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    )}
                </Section>
            </main>
        </Layout>
    );
})

export default Home;
