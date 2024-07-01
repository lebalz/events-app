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
import {
    mdiAccountCircleOutline,
    mdiBookOpenVariantOutline,
    mdiCalendarAccount,
    mdiCalendarMonth,
    mdiCalendarSync,
    mdiChartTimeline,
    mdiMicrosoftOutlook,
    mdiPalette,
    mdiSecurity,
    mdiViewList
} from '@mdi/js';
import Link from '@docusaurus/Link';
import { useStore } from '../stores/hooks';
import Badge from '../components/shared/Badge';
import { Timeline } from '../components/shared/icons';
import Details from '@theme/Details';
import VideoGrid from '@site/src/components/VideoGrid';

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
                <button className={clsx('button', 'button--primary', 'button--block')}>{props.label}</button>
            </div>
        </Link>
    );
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
        <Layout title="Events" description="Events Application">
            <HomepageHeader />
            <main>
                <Section className={clsx(styles.navCardSection)}>
                    <div className={clsx(styles.navCards)}>
                        <NavCard
                            icon={mdiViewList}
                            to={useBaseUrl('/table')}
                            label={translate({
                                message: 'Tabelle',
                                id: 'navcard.table.text',
                                description: 'Button text for navigating to the table page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiCalendarMonth}
                            to={useBaseUrl('/calendar')}
                            label={translate({
                                message: 'Kalender',
                                id: 'navcard.calendar.text',
                                description: 'Button text for navigating to the calendar page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={Timeline}
                            to={useBaseUrl('/gantt')}
                            label={translate({
                                message: 'Zeitachse',
                                id: 'navcard.gantt.text',
                                description: 'Button text for navigating to the gantt page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiCalendarSync}
                            to={useBaseUrl('/subscribe')}
                            label={translate({
                                message: 'Abonnieren',
                                id: 'navcard.subscribe.text',
                                description: 'Button text for navigating to the subscribe page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiBookOpenVariantOutline}
                            to={useBaseUrl('/docs')}
                            label={translate({
                                message: 'Dokumentation',
                                id: 'navcard.docs.text',
                                description: 'Button text for navigating to the documentation page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiAccountCircleOutline}
                            to={useBaseUrl('/user?user-tab=account')}
                            label={translate({
                                message: 'Account',
                                id: 'navcard.user.account',
                                description: 'Button text for navigating to the user account page'
                            })}
                            displayFor="user"
                        />
                        <NavCard
                            icon={mdiCalendarAccount}
                            to={useBaseUrl('/user?user-tab=events')}
                            label={translate({
                                message: 'Meine Events',
                                id: 'navcard.user.events',
                                description: 'Button text for navigating to the users events page'
                            })}
                            displayFor="user"
                        />
                        <NavCard
                            icon={mdiSecurity}
                            to={useBaseUrl('/admin')}
                            label={translate({
                                message: 'Admin',
                                id: 'navcard.admin.text',
                                description: 'Button text for navigating to the admin page'
                            })}
                            displayFor="admin"
                        />
                    </div>
                </Section>
                <Section>
                    {i18n?.currentLocale === 'de' ? (
                        <div className="card" style={{ boxShadow: 'var(--ifm-global-shadow-md)' }}>
                            <div className="card__header">
                                <h2>Einführung Terminkalender</h2>
                            </div>
                            <div className="card__body">
                                Der Terminkalender ist noch in der Einführungsphase, was folgende
                                Einschränkungen mit sich bringt:
                                <ul>
                                    <li>
                                        <b>Erfasste Termine werden erst für das FS2025 veröffentlicht.</b>
                                    </li>
                                    <li>
                                        Die URL der abonnierten Kalender könnte sich während der
                                        Einführungsphase ändern. Dann würden Sie informiert und müssten den
                                        Kalender erneut abonnieren.
                                    </li>
                                    <li>
                                        Nicht alles wird bereits perfekt funktionieren. Rückmeldungen zu
                                        Fehlern oder Anregungen sind nach wie vor sehr willkommen.
                                    </li>
                                </ul>
                                <h3>Vielen Dank für die Mithilfe!</h3>
                            </div>
                            <div className="card__header">
                                <h1>Wie funktioniert's?</h1>
                            </div>
                            <div className="card__body">
                                <VideoGrid
                                    videos={[
                                        {
                                            src: '/videos/Events-Anmelden.mp4',
                                            title: '👉 Anmelden',
                                            href: '/docs/login'
                                        },
                                        {
                                            src: '/videos/Events-Filtern.mp4',
                                            title: '👉 Filtern',
                                            href: '/docs/events/filter'
                                        },
                                        {
                                            src: '/videos/Events-Abonnieren.mp4',
                                            title: '👉 Abonnieren',
                                            href: 'docs/events/subscribe'
                                        },
                                        {
                                            src: '/videos/events-ruttl-de.mp4',
                                            title: '👉 Feedback',
                                            href: 'docs/betaphase',
                                            playbackRate: 0.5
                                        }
                                    ]}
                                />
                            </div>
                            <div className="card__body">
                                <Details summary="Neuerungen des Terminkalenders">
                                    <h3>Changelog</h3>
                                    <h4>Version: Release Candidate 1.0 (27.06.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀💅 Neu: In Gruppen oder beim Import kann zwischen den
                                            verschiedenen Ansichten umgestellt werden
                                        </li>
                                        <li>
                                            🚀: Anleitungen mit kurzen Videos in die Dokumentation
                                            aufgenommen.
                                        </li>
                                        <li>
                                            🐛 Fix: Die Terminfilterung nach eigenen Terminen funktioniert
                                            zuverlässiger und schneller.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.11 (05.05.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀💅 Neu: Benutzende können selber die Hauptfarbe einstellen. In
                                            der Navigationsliste auf{' '}
                                            <Badge
                                                icon={mdiPalette}
                                                color="primary"
                                                className={styles.inline}
                                                size={0.6}
                                            />{' '}
                                            klicken und die Farbe einstellen.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.10 (29.04.2024)</h4>
                                    <ul>
                                        <li>🚀 Neu: Dokumentation und Gebrauchsanweisungen Verlinkt</li>
                                        <li>
                                            🚀 Neu: Aktualisierte, aber noch nicht veröffentlichte Termine
                                            können in einer Übersicht dargestellt werden.
                                        </li>
                                        <li>💅 Aktionen für Termine werden übersichtlicher dargestellt.</li>
                                        <li>
                                            💅 Icons und Tooltips zeigen an, ob ein Termin direkt aktualisiert
                                            wird, oder eine neue Version erzeugt wird.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.9 (28.04.2024)</h4>
                                    <ul>
                                        <li>
                                            💅 Neue Zeilen werden bei den Beschreibungen korrekt angezeigt.
                                        </li>
                                        <li>
                                            💅 Rechts-Klick oder langes drücken auf Tablets öffnet die
                                            Termin-Übersicht.
                                        </li>
                                        <li>
                                            💅 Ist in der Tabelle bei einem Termin kein Text ausgewählt, kann
                                            eine Zeile auch durch erneutes Klicken reduziert werden.
                                        </li>
                                        <li>💅 Zeige den "Edit" Knopf bei unveröffentlichten Terminen an.</li>
                                        <li>
                                            🚀 Neu: Termine in der Übersicht können ausgewählt, geteilt und zu
                                            einer Gruppe hinzugefügt werden.
                                        </li>
                                        <li>
                                            🐛 Fix: Der "Termin Hinzufügen" Knopf wurde nicht angezeigt, wenn
                                            noch keine Termine vorhanden waren.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.8 (17.04.2024)</h4>
                                    <ul>
                                        <li>
                                            💅 Layoutverbesserungen
                                            <ul>
                                                <li>Farben im Dark-Mode angepasst für besseren Kontrast.</li>
                                                <li>
                                                    Kalender-Ansicht: Zeige Wochentag, Tag und Monat (neu: Mo.
                                                    15.4, alt: 15 Mo)
                                                </li>
                                                <li>
                                                    Tabellen-Ansicht: Die Wochen-Balken sind nun stärker
                                                    hervorgehoben (+2pt und mit Farbe ausgefüllt)
                                                </li>
                                                <li>
                                                    Herkömmliche Datumsdarstellung wo sinnvoll (6.4.24 statt
                                                    06.04.2024)
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            🚀 Neu: Erklärende Popups über den Knöpfen und Elementen in der
                                            Tabelle.
                                        </li>
                                        <li>
                                            💅 Ist eine Zeile in der Tabellensicht erweitert, kann sie auch
                                            durch Klicken auf "Lektionen Betroffen Knopf" 🔴🟡🟢 wieder
                                            reduziert werden.
                                        </li>
                                        <li>
                                            💅 Mit <kbd>ctrl + Klick</kbd> kann die Terminübersicht geöffnet
                                            werden.
                                        </li>
                                        <li>🚀 Neu: Eingabefenster für Termine hinzugefügt.</li>
                                        <li>
                                            🐛 Fix: Bei der Termineingabe muss nun mindestens eine Zielgruppe
                                            ausgewählt werden (Klasse, Stufe oder Abteilung)
                                        </li>
                                        <li>🚀 Neu: Download-Format des Excel-Exports.</li>
                                        <li>
                                            🐛 Fix: Der Excel-Export fügt nur die angezeigten Termine ins
                                            Excel ein.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.7 (26.02.2024)</h4>
                                    <ul>
                                        <li>
                                            💅 Verbesserung: Wird der Start oder das Ende eines Termins
                                            verändert, so dass der "Start" nach dem "Ende" erfolgt, wird
                                            automatisch ein zulässiges Datum gesetzt.
                                        </li>
                                        <li>
                                            🚀 Neu: Benachrichtigungen: In den{' '}
                                            <Link to="/user?user-tab=account">👉 Benutzereinstellungen</Link>{' '}
                                            kann festgelegt werden, ob man bei Terminänderungen, die einem
                                            betreffen, per Mail benachrichtigt werden möchte. Benachrichtigt
                                            wirst du, wenn:
                                            <ul>
                                                <li>Ein Termin der dich betrifft, gelöscht wird.</li>
                                                <li>Ein Termin verändert wird, der dich betrifft.</li>
                                                <li>Ein Termin hinzugefügt wird, der dich betrifft.</li>
                                                <li>
                                                    Ein Termin so verändert wird, dass er dich nun nicht mehr
                                                    betrifft.
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            🚀 Neu: Termine können zu einer Gruppe gruppiert werden:
                                            <ul>
                                                <li>Eigene Termine können zu Gruppen hinzugefügt werden.</li>
                                                <li>
                                                    Öffentliche Termine können zu Gruppen hinzugefügt werden.
                                                </li>
                                                <li>Gruppen können kopiert werden.</li>
                                                <li>
                                                    Es gibt einen Editor zum verschieben aller Start- und
                                                    Enddaten um eine feste Anzahl Tage/Stunden von Terminen in
                                                    einer Gruppe.
                                                </li>
                                                <li>Gruppen können mit anderen Personen geteilt werden.</li>
                                            </ul>
                                        </li>
                                        <li>
                                            🐛 Fix: Klassengruppen wurden in der Terminübersicht
                                            fälschlicherweise nicht angezeigt.
                                        </li>
                                        <li>
                                            🐛 Fix: Beim Neuladen der User-Seite wird wieder der zuvor
                                            ausgewählte Tab angezeigt.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.6 (11.02.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀 Neu: Beim Erfassen eines Termins werden nun Erklärungen für die
                                            Eigenschaft "Publikum: Alle/LP/KLP/SuS" angezeigt
                                        </li>
                                        <li>
                                            🚀 Neu: Beim Laden des Profils werden automatisch nur Termine der{' '}
                                            <b>Abteilungen</b> (bspw. Gym GBSL) angezeigt, an welchen man
                                            unterrichtet.
                                        </li>
                                        <li>
                                            💅 Durch erneutes Klicken auf "Betroffene Lektionen laden" können
                                            diese nun auch wieder ausgeblendet werden.
                                        </li>
                                        <li>
                                            🐛 Fix: Falls sich das Login "aufhängt" und oben Links durchgehend
                                            das "Profil" geladen wird, kann durch Klicken auf das Profil und
                                            anschliessendes "Aktualisieren" das Login neu angestossen werden.
                                        </li>
                                        <li>
                                            🐛 Fix: Wird ein Termin auf der französischen Seite geklont,
                                            funktioniert die Weiterleitung nun korrekt.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.5 (6.02.2024)</h4>
                                    <ul>
                                        <li>🐛 Fix: Firefox spielt Video ab</li>
                                        <li>
                                            🐛 Fix: Login sollte nun auf allen Browsern funktionieren und die
                                            Account-Daten werden auch nach dem ersten Login geladen.
                                        </li>
                                        <li>
                                            🔧 Bestätigung für das Löschen eines Events ist nun ein Popup.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.4 (22.01.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀 Eingabe: Option für die Eingabe von ganztägigen Terminen
                                            hinzugefügt.
                                        </li>
                                        <li>
                                            🐛 Fix: Verbesserung des UI's wenn die
                                            Mehrfaktor-Authentifizierung notwendig ist.
                                        </li>
                                        <li>
                                            💅 Zeitachse: Titelleiste ist beim Scrollen oben am Fenster
                                            fixiert.
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.3 (15.01.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀 Inkrementelles Laden: Es werden die öffentlichen Termine
                                            geladen, <b>während</b> die Benutzer:in eingeloggt wird. Sobald
                                            die Anmeldeinformationen vorhanden sind, werden auch die
                                            persönlichen Daten geladen. Führt zu einem schnelleren Laden der
                                            Seite. <a href="https://github.com/lebalz/events-app/pull/17"></a>
                                        </li>
                                        <li>
                                            💅 Logout Button ist nun im sichtbaren Bereich auf der{' '}
                                            <a href="/user?user-tab=account">User-Seite</a>
                                        </li>
                                        <li>🐛 Fix: Abonnierbare Kalender sind korrekt beschriftet</li>
                                        <li>
                                            🐛 Fix: Kalenderwochen werden auch beim Jahreswechsel korrekt
                                            sortiert
                                        </li>
                                    </ul>
                                    <h4>Version: Beta 1.2 (07.01.2024)</h4>
                                    <ul>
                                        <li>
                                            🐛 Fix: Termin-Filter: Wer EF Unterrichtet, wurde bisher
                                            automatisch auch dem GBJB zugeteilt (bei EF's werden alle
                                            Gym-Klassen zugeteilt, also auch Nicht-Bilingue Klassen des GBJB,
                                            so dass bisher eine Zugehörigkeit zum GBJB abgeleitet wurde). Für
                                            das EF bzw. OC ist dieser Fehler behoben. Falls bei anderen
                                            Fächern ebenfalls Schulübergreifend Klassen zugeordnet werden,
                                            gerne melden.{' '}
                                            <a
                                                href="https://github.com/lebalz/events-api/pull/9"
                                                target="_blank"
                                            >
                                                PR: Bilingue flag and relations for events
                                            </a>
                                        </li>
                                        <li>
                                            🚀 Beim Erfassen von Terminen für Bilingua-Klassen, welche nur{' '}
                                            <i>LP</i> oder <i>ALLE</i> betreffen, kann nun angegeben werden,
                                            ob Lehrpersonen der abderen Schule auch betroffen sind (bspw. bei
                                            26Gn das GBJB oder bei 26mT das GBSL){' '}
                                        </li>
                                        <li>
                                            🚀 Admin-Bereich: Bilingue-Departemente können nun den zugehörigen
                                            Schulen zugewiesen werden
                                        </li>
                                        <li>
                                            🚀 Admin-Bereich: GBJB Import von CSV Dateien{' '}
                                            <a href="https://github.com/lebalz/events-api/pull/8">
                                                PR: Create import service for gbjb csv files
                                            </a>
                                        </li>
                                    </ul>
                                </Details>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ boxShadow: 'var(--ifm-global-shadow-md)' }}>
                            <div className="card__body">
                                L'agenda est encore en phase de lancement, ce qui implique les contraintes
                                suivantes :
                                <ul>
                                    <li>
                                        <b>
                                            Les évènements saisies ne seront publiées que pour le semestre de
                                            printemps 2025.
                                        </b>
                                    </li>
                                    <li>
                                        L'URL des calendriers abonnés pourrait changer pendant la phase de
                                        lancement. Dans ce cas, vous seriez informé et vous devriez s'abonner
                                        à nouveau au calendrier.
                                    </li>
                                    <li>
                                        Tout ne fonctionnera pas déjà parfaitement. Les commentaires sur les
                                        erreurs ou des suggestions sont toujours les bienvenues.
                                    </li>
                                </ul>
                                <h3>Merci beaucoup pour votre compréhension et votre aide</h3>
                            </div>
                            <div className="card__header">
                                <h1>Comment ça marche ?</h1>
                            </div>
                            <div className="card__body">
                                <VideoGrid
                                    videos={[
                                        {
                                            src: '/videos/ME-s-identifier.mp4',
                                            title: "S'identifier"
                                        },
                                        {
                                            src: '/videos/ME-les-filtres.mp4',
                                            title: 'Filtrer'
                                        },
                                        {
                                            src: '/videos/ME-s-abonner.mp4',
                                            title: "S'abonner"
                                        },
                                        {
                                            src: '/videos/ME-s-abonner-autre-agenda.mp4',
                                            title: "S'abonner à un autre agenda"
                                        },
                                        {
                                            src: '/videos/ME-exporter-imprimer.mp4',
                                            title: 'Exporter son agenda en format PDF ou papier'
                                        },
                                        {
                                            src: '/videos/events-ruttl-de.mp4',
                                            title: 'Feedback',
                                            playbackRate: 0.5
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    )}
                </Section>
            </main>
        </Layout>
    );
});

export default Home;
