import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { matchPath, useHistory, useLocation } from '@docusaurus/router';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { mdiAccountAlert, mdiBellMinus, mdiCalendarRemove, mdiClockAlert, mdiUndo } from '@mdi/js';
import Icon from '@mdi/react';
import Event from '@site/src/models/Event';
import { default as SubscriptionModel } from '@site/src/models/Subscription';
import User from '@site/src/models/User';
import { useStore } from '@site/src/stores/hooks';
import { ApiState } from '@site/src/stores/iStore';
import Admonition from '@theme/Admonition';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import EventOverviewSmall from '../EventOverviewSmall';
import Button from '../shared/Button';
import { SIZE } from '../shared/icons';
import Loader from '../shared/Loader';
import styles from './styles.module.scss';
type PathParams = { eventId: string };
const PATHNAME_PATTERN = '/unsubscribe/:eventId' as const;

const NoUser = () => {
    return (
        <div className={clsx('alert alert--danger', styles.alert)} role="alert">
            <Icon path={mdiAccountAlert} size={1} color="var(--ifm-color-danger)" />
            <Translate id="unsubscribe.noUser" description="Nicht angemeldet">
                Nicht angemeldet
            </Translate>
        </div>
    );
};
const NoEvent = () => {
    return (
        <div className={clsx('alert alert--danger', styles.alert)} role="alert">
            <Icon path={mdiCalendarRemove} size={1} color="var(--ifm-color-danger)" />
            <Translate id="unsubscribe.noEvent" description="Kein Termin gefunden">
                Termin nicht gefunden
            </Translate>
        </div>
    );
};

interface WithParentRootProps {
    path: string;
}
interface Props {
    event: Event;
    subscription: SubscriptionModel;
}

const UnsubscribeComponent = observer((props: Props) => {
    const { event, subscription } = props;
    const skipUnsubscribe = React.useRef(false);
    const history = useHistory();
    const accountUrl = useBaseUrl('/user?user-tab=account');
    const homeUrl = useBaseUrl('/');
    React.useEffect(() => {
        if (skipUnsubscribe.current) {
            return;
        }
        subscription.ignoreEvent(event.id);
    }, [event, subscription, skipUnsubscribe]);

    return (
        <div className={clsx(styles.unsubscribe)}>
            <Admonition
                className={clsx(styles.admonition)}
                type="danger"
                icon={<Icon path={mdiBellMinus} size={1.5} color="red" />}
                title={translate({ id: 'unsubscribe.title', message: 'Termin Abbestellt' })}
            >
                <p>
                    <Translate id="unsubscribe.success" description="Successfully unsubscribed">
                        Der Termin wird nicht mehr im persönlichen Kalender angezeigt.
                    </Translate>
                </p>
                <EventOverviewSmall event={event} className={clsx(styles.event)} />
                <Admonition
                    type="warning"
                    icon={<Icon path={mdiClockAlert} size={SIZE} color="orange" />}
                    title={translate({
                        id: 'unsubscribe.calendarPickup.title',
                        message: 'Zeitverzögerte Aktualisierung im Kalender (24h)'
                    })}
                >
                    <Translate id="unsubscribe.calendarPickup">
                        Bis die Änderungen vom Kalenderprogramm übernommen werden, kann es einige Zeit dauern
                        (bis zu 24h, abhängig vom Synchronisierungsintervall).
                    </Translate>
                </Admonition>
            </Admonition>
            <Link to={accountUrl} style={{ alignSelf: 'center' }}>
                <Translate id="unsubscribe.go2settings" description="Go to the settings">
                    👉 Zu den Einstellungen
                </Translate>
            </Link>

            <div className={clsx('alert alert--warning', styles.alert)} role="alert">
                <Translate id="unsubscribe.undo" description="Rückgängig machen">
                    Rückgängig machen
                </Translate>
                <Button
                    icon={mdiUndo}
                    color="orange"
                    onClick={() => {
                        skipUnsubscribe.current = true;
                        subscription.unignoreEvent(event.id);
                        history.push(homeUrl);
                    }}
                    title={translate({
                        id: 'subscription.unsubscribe',
                        message: 'Diesen Termin wieder im persönlichen Kalender anzeigen.'
                    })}
                />
            </div>
        </div>
    );
});
interface WithSubscriptionProps {
    user: User;
    unsubscribedEventId: string;
}

const WithSubscription = observer((props: WithSubscriptionProps) => {
    const { user } = props;
    const subscriptionStore = useStore('subscriptionStore');
    const eventStore = useStore('eventStore');
    const unsubscribeEvent = eventStore.find<Event>(props.unsubscribedEventId);
    React.useEffect(() => {
        if (!user.subscription) {
            subscriptionStore.create({}).then(
                action((subscription) => {
                    if (subscription) {
                        user.setSubscriptionId(subscription.id);
                    }
                })
            );
        }
    }, [user]);
    React.useEffect(() => {
        eventStore.loadModel(props.unsubscribedEventId);
    }, [eventStore]);

    if (!user.subscription) {
        return <Loader />;
    }
    if (!unsubscribeEvent) {
        if (eventStore.apiStateFor(`load-${props.unsubscribedEventId}`) === ApiState.LOADING) {
            return <Loader />;
        }
        return <NoEvent />;
    }

    return <UnsubscribeComponent event={unsubscribeEvent} subscription={user.subscription} />;
});

const WithUser = observer((props: WithParentRootProps): React.ReactNode => {
    const routeParams = matchPath<PathParams>(props.path, PATHNAME_PATTERN);
    const { eventId } = routeParams?.params || {};
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!eventId) {
        return null;
    }
    if (!current) {
        return <NoUser />;
    }

    return <WithSubscription user={current} unsubscribedEventId={eventId} />;
});

const Unsubscribe = observer(() => {
    const location = useLocation();
    return (
        <Layout title={translate({ id: 'unsubscribe.title', message: 'Termin Abbestellt' })}>
            <div className={clsx(styles.wrapper)}>
                <BrowserOnly fallback={<Loader />}>{() => <WithUser path={location.pathname} />}</BrowserOnly>
            </div>
        </Layout>
    );
});

export default Unsubscribe;
