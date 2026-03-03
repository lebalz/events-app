import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Section from '../components/shared/Section';
import Translate, { translate } from '@docusaurus/Translate';
import Icon from '@mdi/react';
import {
    mdiAccountCircleOutline,
    mdiArrowExpandHorizontal,
    mdiBellMinus,
    mdiBellPlusOutline,
    mdiBookOpenVariantOutline,
    mdiCalendarAccount,
    mdiCalendarMonth,
    mdiCalendarPlus,
    mdiCalendarSync,
    mdiPalette,
    mdiPen,
    mdiSecurity,
    mdiToggleSwitchOutline,
    mdiViewList
} from '@mdi/js';
import Link from '@docusaurus/Link';
import { useStore } from '../stores/hooks';
import Badge from '../components/shared/Badge';
import { Timeline } from '../components/shared/icons';
import Details from '@theme/Details';
import VideoGrid from '@site/src/components/VideoGrid';
import EventOverviewSmall from '../components/EventOverviewSmall';
import { DAYS_LONG, formatDate } from '../models/helpers/time';
import Video from '../components/VideoGrid/Video';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className={clsx('hero__title', styles.title)}>{siteConfig.title}</h1>
                <p className={clsx('hero__subtitle', styles.tagline)}>{siteConfig.tagline}</p>
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
    className?: string;
    style?: React.CSSProperties;
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
        <Link to={props.to} className={clsx('card', styles.navCard, props.className)} style={props.style}>
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
    const viewStore = useStore('viewStore');
    const [today, setToday] = React.useState(new Date());
    const [showToday, setShowToday] = React.useState<'mine' | 'all'>('mine');
    const baseUrl = useBaseUrl('/');
    const withBaseUrl = (url: string) => {
        if (url.startsWith(baseUrl)) {
            return url;
        }
        if (url.startsWith('/')) {
            return baseUrl + url.substring(1);
        }
        return baseUrl + url;
    };
    React.useEffect(() => {
        if (ref.current) {
            ref.current.playbackRate = 0.5;
        }
    }, [ref]);
    React.useEffect(() => {
        setToday(new Date());
    }, []);

    const todaysEvents =
        showToday === 'mine' && viewStore.user?.untisId
            ? viewStore.todayEventsForUser
            : viewStore.todayEvents;
    return (
        <Layout title="Events" description="Events Application">
            <HomepageHeader />
            <main>
                <Section
                    className={clsx(styles.today)}
                    classNameTitle={clsx(styles.todayTitle)}
                    title={
                        <>
                            <Translate
                                values={{ date: formatDate(today, true), day: DAYS_LONG[today.getDay()] }}
                                id="home.today.title"
                                description="Title for the today section"
                            >
                                {'{day} {date}'}
                            </Translate>
                            {viewStore.user?.untisTeacher && (
                                <div
                                    className={clsx('button-group', styles.switcher)}
                                    style={{ marginLeft: '1em' }}
                                >
                                    <button
                                        className={clsx(
                                            'button',
                                            'button--sm',
                                            'button--secondary',
                                            styles.switcherButton,
                                            showToday === 'mine' && 'button--active'
                                        )}
                                        onClick={() => setShowToday('mine')}
                                    >
                                        <Translate id="home.today.mine" description="Only show my events">
                                            Meine
                                        </Translate>
                                        <Badge
                                            text={`${viewStore.todayEventsForUser.length}`}
                                            size={0.6}
                                            className={clsx(styles.numEvents)}
                                        />
                                    </button>
                                    <button
                                        className={clsx(
                                            'button',
                                            'button--sm',
                                            'button--secondary',
                                            styles.switcherButton,
                                            showToday === 'all' && 'button--active'
                                        )}
                                        onClick={() => setShowToday('all')}
                                    >
                                        <Translate id="home.today.all" description="Show all events">
                                            Alle
                                        </Translate>
                                        <Badge
                                            text={`${viewStore.todayEvents.length}`}
                                            size={0.6}
                                            className={clsx(styles.numEvents)}
                                        />
                                    </button>
                                </div>
                            )}
                        </>
                    }
                >
                    <div className={clsx(styles.todaysEvents)}>
                        {todaysEvents.length > 0 ? (
                            <>
                                {todaysEvents.map((event) => (
                                    <EventOverviewSmall
                                        key={event.id}
                                        event={event}
                                        className={clsx(styles.eventOverview)}
                                        showDayname
                                    />
                                ))}
                            </>
                        ) : (
                            <Translate id="home.today.noEvents" description="No events for today">
                                Keine Termine für heute
                            </Translate>
                        )}
                    </div>
                </Section>
                <Section className={clsx(styles.navCardSection)}>
                    <div className={clsx(styles.navCards)}>
                        <NavCard
                            icon={mdiViewList}
                            to={withBaseUrl('/table')}
                            label={translate({
                                message: 'Tabelle',
                                id: 'navcard.table.text',
                                description: 'Button text for navigating to the table page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiCalendarMonth}
                            to={withBaseUrl('/calendar')}
                            label={translate({
                                message: 'Kalender',
                                id: 'navcard.calendar.text',
                                description: 'Button text for navigating to the calendar page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={Timeline}
                            to={withBaseUrl('/gantt')}
                            label={translate({
                                message: 'Zeitachse',
                                id: 'navcard.gantt.text',
                                description: 'Button text for navigating to the gantt page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiCalendarSync}
                            to={withBaseUrl('/subscribe')}
                            label={translate({
                                message: 'Abonnieren',
                                id: 'navcard.subscribe.text',
                                description: 'Button text for navigating to the subscribe page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiBookOpenVariantOutline}
                            to={withBaseUrl('/docs')}
                            label={translate({
                                message: 'Dokumentation',
                                id: 'navcard.docs.text',
                                description: 'Button text for navigating to the documentation page'
                            })}
                            displayFor="public"
                        />
                        <NavCard
                            icon={mdiAccountCircleOutline}
                            to={withBaseUrl('/user?user-tab=account')}
                            label={translate({
                                message: 'Account',
                                id: 'navcard.user.account',
                                description: 'Button text for navigating to the user account page'
                            })}
                            displayFor="user"
                        />
                        <NavCard
                            icon={mdiCalendarAccount}
                            to={withBaseUrl('/user?user-tab=events')}
                            label={translate({
                                message: 'Meine Events',
                                id: 'navcard.user.events',
                                description: 'Button text for navigating to the users events page'
                            })}
                            displayFor="user"
                        />
                        <NavCard
                            icon={mdiSecurity}
                            to={withBaseUrl('/admin')}
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
                                <h1>Wie funktioniert's?</h1>
                            </div>
                            {i18n?.currentLocale === 'de' && (
                                <div className="card__body">
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <NavCard
                                            icon={mdiCalendarPlus}
                                            to={withBaseUrl('/docs/events/new')}
                                            label={translate({
                                                message: 'Anleitung: Termin erfassen',
                                                id: 'navcard.tutorial.newEvent'
                                            })}
                                            displayFor="public"
                                            style={{ maxWidth: '20em' }}
                                        />
                                    </div>
                                </div>
                            )}
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
                                        }
                                        // {
                                        //     src: '/videos/events-ruttl-de.mp4',
                                        //     title: '👉 Feedback',
                                        //     href: 'docs/betaphase',
                                        //     playbackRate: 0.5
                                        // }
                                    ]}
                                />
                            </div>
                            <div className="card__body">
                                <h4>Version: 1.9 (16.02.2026)</h4>
                                <ul>
                                    <li>
                                        🚀 Neu: Filterung von Terminen nach Wochentag, Lektion, Jahrgang und
                                        Klassen.
                                    </li>
                                    <li>
                                        🐛 Fix: Webseite stürzt nicht mehr ab, wenn nicht angemeldete
                                        User:innen den Terminfilter verwenden.
                                    </li>
                                </ul>
                                <Details summary="Neuerungen des Terminkalenders">
                                    <h3>Changelog</h3>
                                    <h4>Version: 1.8 (23.11.2025)</h4>
                                    <ul>
                                        <li>
                                            🚀 Neu: Terminen können nun Lehrpersonen hinzugefügt werden.
                                            <ul>
                                                <li>
                                                    Lehrpersonen können bei der Termineingabe hinzugefügt
                                                    werden.
                                                </li>
                                                <li>
                                                    Zugewiesene LP's werden <b>nur angemeldeten</b>{' '}
                                                    Benutzer:innen angezeigt.
                                                </li>
                                                <li>
                                                    Bei den "betroffenen Lektionen" werden auch die von den
                                                    zugewiesenen Lehrpersonen betroffenen Klassen angezeigt.
                                                </li>
                                                <li>
                                                    LP's erhalten zugewiesene Termine in ihrer persönlichen
                                                    Übersicht und im Kalender-Abo angezeigt.
                                                </li>
                                                <li>
                                                    Ist eine LP aufgrund einer Zuweisung zu einem Termin
                                                    betroffen, werden deren Klassen aber <b>nicht</b>{' '}
                                                    automatisch als betroffen markiert. Andernfalls wäre der
                                                    Datenschutz nicht gewährleistet, da dann die Zuweisung von
                                                    Lehrpersonen öffentlich zugänglich sein müsste.
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            💅 Verbesserung: diverse Optimierungen beim Erfassen von Terminen
                                        </li>
                                    </ul>
                                    <h4>Version: 1.7 (23.08.2025)</h4>
                                    <ul>
                                        <li>
                                            💅 Verbesserung: Im Stundenplan werden Klassenbezeichnungen nun
                                            auch bei Einzellektionen angezeigt.
                                        </li>
                                        <li>
                                            🐛 Fix: Auch nicht-angemeldete User können Klassen und
                                            Departemente abonnieren.
                                        </li>
                                    </ul>
                                    <h4>Version: Release Candidate 1.6 (9.4.2025)</h4>
                                    <ul>
                                        <li>🚀 Neu: Alle Terminansichten können gefiltert werden.</li>
                                        <li>
                                            🚀 Neu: Selbst erfasste, neue Schulklassen (die noch nicht auf
                                            WebUntis geführt werden), werden nun auch als Option angezeigt.
                                        </li>
                                        <li>
                                            🚀 Neu: Optimierung der Abteilungs- und Klassenauswahl.
                                            <ul>
                                                <li>
                                                    Toggle-Button{' '}
                                                    <Icon
                                                        path={mdiToggleSwitchOutline}
                                                        size={0.8}
                                                        color="var(--ifm-color-success)"
                                                    />
                                                    , um alle Klassen eines Jahrgangs aus- oder abzuwählen.
                                                </li>
                                                <li>
                                                    Möglichkeit zum Entfernen von Redundanzen - ist bspw. die{' '}
                                                    <strong className="boxed">28Gj</strong> und gleichzeitig
                                                    die Abteilung <strong className="boxed">GYMD</strong>{' '}
                                                    ausgewählt, ist die Klasse{' '}
                                                    <strong className="boxed">28Gj</strong> implizit bereits
                                                    betroffen, so dass sie nicht erfasst werden muss.
                                                    <br />
                                                    Dieser Schritt passiert automatisch beim Einreichen eines
                                                    Termins - er kann aber auch manuell vorgängig ausgelöst
                                                    werden.
                                                </li>
                                                <li>
                                                    <div
                                                        style={{ display: 'flex', justifyContent: 'center' }}
                                                    >
                                                        <div className="card" style={{ maxWidth: '40em' }}>
                                                            <div className="card__image">
                                                                <img
                                                                    src={
                                                                        require('./images/select-audience.png')
                                                                            .default
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="card__body">
                                                                <ol
                                                                    type="1"
                                                                    style={{ listStyleType: 'decimal' }}
                                                                >
                                                                    <li>
                                                                        Eine ganze Klassenstufe wird
                                                                        ausgewählt -{' '}
                                                                        <strong className="boxed">
                                                                            25G*
                                                                        </strong>{' '}
                                                                        wird hinzugefügt
                                                                    </li>
                                                                    <li>
                                                                        Alle Klassen einer Stufe über den
                                                                        "Toggle-Button" ausgewählt, es werden{' '}
                                                                        <code>13</code> Klassen einzeln
                                                                        hinzugefügt.
                                                                    </li>
                                                                    <li>Einzelne Klasse ausgewählt.</li>
                                                                    <li>
                                                                        Knopf zum Entfernen von Redundanzen
                                                                    </li>
                                                                </ol>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            🚀 Neu [Administrativ]: Optional zum Abteilungsbuchstaben (bspw.{' '}
                                            <strong className="boxed">G</strong> für `GYMD`) kann ein{' '}
                                            <b>Anzeigebuchstaben</b> festgelegt werden. Dadurch kann bspw. die{' '}
                                            <strong className="boxed">FMPäd</strong> und{' '}
                                            <strong className="boxed">MSOP</strong> als eigene Abteilung mit
                                            den Buchstaben <strong className="boxed">E</strong> bzw.{' '}
                                            <strong className="boxed">e</strong> geführt werden, sie werden
                                            jedoch nach wie vor mit dem Anzeigebuchstaben{' '}
                                            <strong className="boxed">F</strong> bzw.{' '}
                                            <strong className="boxed">s</strong> angezeigt.
                                            <div className="alert alert--warning">
                                                Soll die gesamte Klassenstufe ausgewählt werden (wenn es sie
                                                noch nicht gibt), muss im Eingabefeld{' '}
                                                <strong className="boxed">26E*</strong> eingegeben werden (
                                                <strong className="boxed">26F*</strong> wäre ja für die FMS).
                                            </div>
                                        </li>
                                        <li>
                                            🚀 Neu [Administrativ]: Bei den Abteilungen kann die
                                            Ausbildungsdauer in Jahren hinterlegt werden. Somit ist es
                                            möglich, die für einen Termin relevanten Klassen anzuzeigen.
                                        </li>
                                    </ul>
                                    <h4>Version: Release Candidate 1.5 (11.3.2025)</h4>
                                    <ul>
                                        <li>
                                            🚀 Neu: Bei der Termineingabe lassen sich Klassen, Klassengruppen
                                            und Abteilungen auch per Drow-Down hinzufügen.
                                        </li>
                                        <li>
                                            🚀 Neu: Für das Feld "Unterricht betroffen" wird nun eine
                                            Erklärung mit Beispielen angezeigt.
                                            <ul>
                                                <li>
                                                    Die Beispiele werden standardmässig angezeigt, können aber
                                                    auch ausgeblendet werden.
                                                </li>
                                                <li>
                                                    <Video
                                                        src="/videos/Events-Demo-teachingAffected.mp4"
                                                        autoplay
                                                        loop
                                                        style={{ maxWidth: '40em' }}
                                                    />
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            💅 Verbesserung: Ist kein Anmeldefenster offen, wird dies als
                                            Information angezeigt, der Termin erscheint aber nicht mehr als
                                            invalid.
                                        </li>
                                        <li>
                                            💅: Verbesserung: Um Warnungen und Hinweise bei neuen Terminen
                                            anzuzeigen, muss das Symbol nicht mehr angeklickt werden - das
                                            drüberfahren mit der Maus reicht.
                                        </li>
                                        <li>
                                            🐛 Fix: Bei fehlerhaften Login-Versuchen sollte nun ein Hinweis
                                            erscheinen, wie das Problem behoben werden kann.
                                        </li>
                                    </ul>
                                    <h4>Version: Release Candidate 1.4 (6.1.2025)</h4>
                                    <ul>
                                        <li>
                                            🚀 Neu: Termine können selbst erzeugten Gruppen hinzugefügt
                                            werden.
                                            <ul>
                                                <li>
                                                    Gruppen sind wie <b>Ordner</b>, die wahlweise mit anderen
                                                    Personen geteilt werden.
                                                </li>
                                                <li>
                                                    Gruppen können kopiert werden - alle enthaltenen Termine
                                                    werden ebenfalls kopiert, wobei deren Status auf "Entwurf"{' '}
                                                    <Icon
                                                        path={mdiPen}
                                                        size={0.8}
                                                        color="var(--ifm-color-blue)"
                                                    />{' '}
                                                    gesetzt wird.
                                                </li>
                                                <li>
                                                    Alle Entwürfe in einer Gruppe lassen sich Verschieben:
                                                    <ul>
                                                        <li>
                                                            <b>Datum-Editor</b>: Alle Termine können bspw. um
                                                            ein Jahr verschoben werden.
                                                        </li>
                                                        <li>
                                                            <b>Klassen-Editor</b>: Die Klassen der Termine
                                                            können wahlweise individuell neu zugeordnet werden
                                                            oder alle um bspw. ein Jahr verschoben werden.
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    Änderungen zwischen den Terminen kopierter Gruppen können
                                                    nachverfolgt werden.
                                                </li>
                                                <li>
                                                    📚 Anleitung:
                                                    <Link to="/docs/events/shift">
                                                        👉 Termine aufs nächste Jahr übertragen
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/user?user-tab=groups">
                                                        👉 Ausprobieren: Zu den Termin-Gruppen
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            🚀 Leistungsverbesserung: Die persönliche Übersicht bei den
                                            Terminen wird nun schneller geladen.
                                        </li>
                                        <li>
                                            🔧 Teachnologie-Upgrade (im Hintergrund): Es werden nun{' '}
                                            <a
                                                href="https://nodejs.org/en/blog/release/v22.12.0"
                                                target="_blank"
                                            >
                                                👉 Node 22
                                            </a>{' '}
                                            und
                                            <a
                                                href="https://react.dev/blog/2024/12/05/react-19"
                                                target="_blank"
                                            >
                                                👉 React 19
                                            </a>{' '}
                                            verwedet.
                                        </li>
                                    </ul>
                                    <h4>Version: Release Candidate 1.3 (20.12.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀 Neu: Es kann nun ein persönliches Kalender-Abo erzeugt werden.
                                            Hinzufügen lassen sich:
                                            <ul>
                                                <li>
                                                    <Icon
                                                        path={mdiBellPlusOutline}
                                                        size={0.8}
                                                        color="green"
                                                    />{' '}
                                                    Die persönlichen Termine
                                                </li>
                                                <li>
                                                    <Icon
                                                        path={mdiBellPlusOutline}
                                                        size={0.8}
                                                        color="green"
                                                    />{' '}
                                                    Die Termine einer Klasse
                                                </li>
                                                <li>
                                                    <Icon
                                                        path={mdiBellPlusOutline}
                                                        size={0.8}
                                                        color="green"
                                                    />{' '}
                                                    Die Termine einer Abteilung
                                                </li>
                                            </ul>
                                            wobei <b>doppelte Termine automatisch entfernt werden 🥳</b>.
                                        </li>
                                        <li>
                                            🚀 Neu: Einzelne Termine lassen sich aus dem Kalenderabo entfernen{' '}
                                            <Icon path={mdiBellMinus} size={0.8} color="red" />.
                                        </li>
                                        <li>
                                            🚀 Neu: Bei abonnierten Kalendern kann können Termine über einen
                                            Link in der Beschreibung abbestellt werden.
                                        </li>
                                        <li>
                                            🐛 Fix: Fehler beim Speichern eines Termins, dass der "Speichern"
                                            Knopf deaktiviert war, wurde behoben.
                                        </li>
                                    </ul>
                                    <h4>Version: Release Candidate 1.2 (04.11.2024)</h4>
                                    <ul>
                                        <li>
                                            🚀💅 Neu: Die Startseite enthält eine simple Terminübersicht für
                                            den aktuellen Tag. Es kann zwischen den eigenen ("Meine") und
                                            allen Terminen gewechselt werden.
                                        </li>
                                        <li>
                                            🚀Neu: Bei der Termineingabe wird nun eine Warnung angezeigt, wenn
                                            es für einen Termin überlagerungen gibt.
                                        </li>
                                        <li>
                                            Aktualisierung der verwendeten Frameworks (Docusaurus v3.6.0).
                                        </li>
                                    </ul>
                                    <h4>Version: Release Candidate 1.1 (30.08.2024)</h4>
                                    {i18n?.currentLocale === 'de' ? (
                                        <div className={clsx('alert', 'alert--warning', styles.alert)}>
                                            <h5>
                                                Fehlerkorrektur 28.08.2024:{' '}
                                                <a href="https://events.gbsl.website/event?id=b8fa310e-0e6c-4161-a552-a49997152fe9&id=83258126-0871-43d2-aa8e-ffd9e8932b97&id=3d67f0e4-3717-4fa4-b363-d9cbc6292caa&id=6c8520a3-7a1b-46bf-a316-d1feb80eb199&id=f6600ef1-3ec5-4ce5-9375-a664dcba97e8&id=d36fc63d-1a9e-45c3-ad1c-15b69a11e8d0">
                                                    Fehlende Termine
                                                </a>{' '}
                                                bei der Filterfunktion "Meine" behoben
                                            </h5>
                                            <p>
                                                Bei der Filterfunktion "Meine" wurden nicht in jedem Fall alle
                                                Termine angezeigt, die für die angemeldete Person relevant
                                                sind. Betroffen waren diese{' '}
                                                <a href="https://events.gbsl.website/event?id=b8fa310e-0e6c-4161-a552-a49997152fe9&id=83258126-0871-43d2-aa8e-ffd9e8932b97&id=3d67f0e4-3717-4fa4-b363-d9cbc6292caa&id=6c8520a3-7a1b-46bf-a316-d1feb80eb199&id=f6600ef1-3ec5-4ce5-9375-a664dcba97e8&id=d36fc63d-1a9e-45c3-ad1c-15b69a11e8d0">
                                                    👉 6 Termine
                                                </a>
                                                , der Fehler wurde behoben.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className={clsx('alert', 'alert--warning', styles.alert)}>
                                            <h5>
                                                Correction d'erreur 28.08.2024 : Problèmes résolus concernant
                                                les{' '}
                                                <a href="https://events.gbsl.website/event?id=b8fa310e-0e6c-4161-a552-a49997152fe9&id=83258126-0871-43d2-aa8e-ffd9e8932b97&id=3d67f0e4-3717-4fa4-b363-d9cbc6292caa&id=6c8520a3-7a1b-46bf-a316-d1feb80eb199&id=f6600ef1-3ec5-4ce5-9375-a664dcba97e8&id=d36fc63d-1a9e-45c3-ad1c-15b69a11e8d0">
                                                    évènements manquants
                                                </a>{' '}
                                                dans la fonction de filtrage "Les miens"
                                            </h5>
                                            <p>
                                                Dans certains cas, la fonction de filtrage "Les miens" ne
                                                montrait pas tous les évènements pertinents pour la personne
                                                connectée. Ce problème a été résolu. Les{' '}
                                                <a href="https://events.gbsl.website/event?id=b8fa310e-0e6c-4161-a552-a49997152fe9&id=83258126-0871-43d2-aa8e-ffd9e8932b97&id=3d67f0e4-3717-4fa4-b363-d9cbc6292caa&id=6c8520a3-7a1b-46bf-a316-d1feb80eb199&id=f6600ef1-3ec5-4ce5-9375-a664dcba97e8&id=d36fc63d-1a9e-45c3-ad1c-15b69a11e8d0">
                                                    👉 6 évènements
                                                </a>{' '}
                                                étaient concernés, le problème a été résolu.
                                            </p>
                                        </div>
                                    )}
                                    <ul>
                                        <li>
                                            🚀💅 Neu: Die Spalte "Beschreibung" kann auf über den Knopf{' '}
                                            <Icon path={mdiArrowExpandHorizontal} size={1} />{' '}
                                            vergrössert/verkleinert werden
                                        </li>
                                        <li>
                                            🚀💅 Neu: wird bei der Kalender-Ansicht ein Datum eines neuen
                                            Semesters erreicht, wird dieses automatisch geladen und angezeigt.
                                        </li>
                                        <li>
                                            💅 Ganztägige Kalender-Events werden nun auch im Apple Kalender
                                            als solche angezeigt. Leider funktioniert dies aber bei Apple nur
                                            bei Terminen, die um Mitternacht starten und auch enden.
                                        </li>
                                        <li>
                                            🐛 Fix: Der Algorithmus zur Terminfilterung wurde verbessert, so
                                            dass nun auch Termine die Sowohl Abteilungen wie auch einzelne
                                            Klassen betreffen, korrekt gefiltert werden.
                                        </li>
                                        <li>
                                            🐛 Fix: Zeige auf der Userseite nur die Klassen und Abteilungen
                                            des aktuellen Semesters an.
                                        </li>
                                        <li>🐛 Fix: Fehler beim Logout wurde behoben.</li>
                                    </ul>
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
                                <div className="card__body">
                                    <h4>Version: Release Candidate 1.4 (6.1.2025)</h4>
                                    <ul>
                                        <li>
                                            🚀 Nouveauté : Les évènements peuvent être ajoutés à des groupes
                                            créés par l'utilisateur..
                                            <ul>
                                                <li>
                                                    Les groupes sont comme des <b>dossiers</b> qui peuvent
                                                    être partagés au choix avec d'autres personnes.
                                                </li>
                                                <li>
                                                    Les groupes peuvent être copiés - tous les évèmements
                                                    qu'ils contiennent sont également copiés, avec leur statut
                                                    de « brouillon »{' '}
                                                    <Icon
                                                        path={mdiPen}
                                                        size={0.8}
                                                        color="var(--ifm-color-blue)"
                                                    />{' '}
                                                    activé.
                                                </li>
                                                <li>
                                                    Tous les projets d'un groupe peuvent être déplacés :
                                                    <ul>
                                                        <li>
                                                            <b>Éditeur de dates</b>: toutes les dates peuvent
                                                            être reportées d'un an, par exemple.
                                                        </li>
                                                        <li>
                                                            <b>Éditeur de classes</b>: les classes des
                                                            évènements peuvent être réaffectées
                                                            individuellement ou être déplacées par exemple
                                                            d'un an.
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                    Les modifications entre les dates des groupes copiés
                                                    peuvent être suivies.
                                                </li>
                                                <li>
                                                    📚 Documentation :
                                                    <Link to="/docs/events/shift">
                                                        👉 Reporter des dates sur l'année suivante
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/user?user-tab=groups">
                                                        👉 Faire des essais : Vers les groupes de d'évènements
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            🚀 Amélioration des performances : l'aperçu personnel des
                                            évènements est plus rapide et se charge désormais plus rapidement.
                                        </li>
                                        <li>
                                            🔧 Mise à niveau technologique (en arrière-plan):{' '}
                                            <a
                                                href="https://nodejs.org/en/blog/release/v22.12.0"
                                                target="_blank"
                                            >
                                                👉 Node 22 et
                                            </a>{' '}
                                            und
                                            <a
                                                href="https://react.dev/blog/2024/12/05/react-19"
                                                target="_blank"
                                            >
                                                👉 React 19
                                            </a>{' '}
                                            .
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </Section>
            </main>
        </Layout>
    );
});

export default Home;
