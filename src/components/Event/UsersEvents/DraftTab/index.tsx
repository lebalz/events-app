import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import styles from '../styles.module.scss';
import { COLUMN_CONFIG } from '..';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import RegPeriodBadge from '@site/src/components/RegistrationPeriod/RegPeriodBadge';
import { useWindowSize } from '@docusaurus/theme-common';
import AddButton from '../../AddButton';
import { toGlobalDate } from '@site/src/models/helpers/time';
import NoEventsAlert from '../NoEventsAlert';
interface Props {
    viewType: View;
    onChangeView: (view: View) => void;
}

const AddEventButton = observer(() => {
    const eventStore = useStore('eventStore');
    const windowSize = useWindowSize();
    const viewStore = useStore('viewStore');
    return (
        <AddButton
            text={translate({
                message: 'Neues Event',
                description: 'AddButton text',
                id: 'event.AddButton.text'
            })}
            onAdd={() => {
                const now = toGlobalDate(new Date());
                const t1 = new Date(now);
                t1.setHours(t1.getHours() + 1);
                eventStore.create({ start: now.toISOString(), end: t1.toISOString() }).then((newEvent) => {
                    if (windowSize === 'mobile') {
                        viewStore.setEventModalId(newEvent.id);
                    }
                });
            }}
            apiState={eventStore.apiStateFor('create')}
            title={translate({
                message: 'Erstellt einen neuen, unveröffentlichten Termin',
                id: 'event.AddButton.title'
            })}
        />
    );
});

const DraftTab = observer((props: Props) => {
    const { viewType } = props;
    const viewStore = useStore('viewStore');
    const regPeriodStore = useStore('registrationPeriodStore');
    const events = viewStore.draftEvents;
    const label = translate({
        message: 'Entwürfe (Unveröffentlicht)',
        id: 'components.event.usersevents.index.header.notpublished',
        description: 'Th: not published'
    });
    if (events.length === 0) {
        return <NoEventsAlert category={label} />;
    }

    return (
        <div className={clsx(styles.card, 'card')}>
            <div className={clsx('card__header')}>
                <h3>{label}</h3>
            </div>
            <div className={clsx('card__body', styles.bulk)}>
                <div className={clsx(styles.alert, 'alert', 'alert--secondary')} role="alert">
                    <h4>
                        <Translate id="userEvents.regPeriod.alert.title">Eingabefenster</Translate>
                    </h4>
                    {regPeriodStore.registrationPeriods.map((regPeriod) => {
                        return <RegPeriodBadge key={regPeriod.id} period={regPeriod} />;
                    })}
                </div>
            </div>
            <EventsViewer
                events={events}
                gridConfig={{ columns: COLUMN_CONFIG }}
                bulkActionConfig={{
                    className: styles.indent,
                    middleActions: [<AddEventButton key="action-m1" />],
                    rightActions: [
                        <ChangeViewAction
                            viewType={viewType}
                            setViewType={props.onChangeView}
                            key="action-r1"
                        />
                    ]
                }}
                type={viewType}
            />
        </div>
    );
});

export default DraftTab;
