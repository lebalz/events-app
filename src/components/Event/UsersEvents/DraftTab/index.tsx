import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import styles from '../styles.module.scss';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import RegPeriodBadge from '@site/src/components/RegistrationPeriod/RegPeriodBadge';
import { useWindowSize } from '@docusaurus/theme-common';
import AddButton from '../../AddButton';
import { toGlobalDate } from '@site/src/models/helpers/time';
import NoEventsAlert from '../NoEventsAlert';
import useIsMobileView from '@site/src/hookes/useIsMobileView';
import Button from '@site/src/components/shared/Button';
import { SIZE_XS, SIZE_XXS } from '@site/src/components/shared/icons';
import { mdiMinusBox, mdiPlusBox } from '@mdi/js';
interface Props {
    viewType: View;
    onChangeView: (view: View) => void;
}

const AddEventButton = observer(({ addMarginTop }: { addMarginTop?: boolean }) => {
    const eventStore = useStore('eventStore');
    const windowSize = useWindowSize();
    const viewStore = useStore('viewStore');
    const isMobileView = useIsMobileView(600);
    return (
        <AddButton
            text={
                isMobileView
                    ? undefined
                    : translate({
                          message: 'Neuer Termin',
                          description: 'AddButton text',
                          id: 'event.AddButton.text'
                      })
            }
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
            className={clsx(styles.addButton, addMarginTop && styles.addMargin)}
        />
    );
});

const RegPeriodInfo = observer(() => {
    const [showAll, setShowAll] = React.useState(false);
    const regPeriodStore = useStore('registrationPeriodStore');
    const periods = showAll ? regPeriodStore.registrationPeriods : regPeriodStore.futurePeriods;
    return (
        <div className={clsx(styles.registrationPeriods, 'alert', 'alert--secondary')} role="alert">
            <h4 className={clsx(styles.regPeriodHeader)}>
                <Translate id="userEvents.regPeriod.alert.title">Eingabefenster</Translate>
                <Button
                    text={
                        showAll
                            ? translate({
                                  message: 'Aktuelle anzeigen',
                                  id: 'userEvents.regPeriod.alert.showCurrent'
                              })
                            : translate({
                                  message: 'Vergangene anzeigen',
                                  id: 'userEvents.regPeriod.alert.showAll'
                              })
                    }
                    icon={showAll ? mdiMinusBox : mdiPlusBox}
                    iconSide="left"
                    size={SIZE_XS}
                    onClick={() => setShowAll((s) => !s)}
                />
            </h4>
            {periods.map((regPeriod) => {
                return <RegPeriodBadge key={regPeriod.id} period={regPeriod} />;
            })}
        </div>
    );
});

const DraftTab = observer((props: Props) => {
    const { viewType } = props;
    const viewStore = useStore('viewStore');
    const events = viewStore.draftEvents;
    const label = translate({
        message: 'Entwürfe (Unveröffentlicht)',
        id: 'components.event.usersevents.index.header.notpublished',
        description: 'Th: not published'
    });
    if (events.length === 0) {
        return (
            <div className={clsx(styles.card, 'card')}>
                <div className={clsx('card__header')}>
                    <h3>{label}</h3>
                </div>
                <div className={clsx('card__body', styles.bulk)}>
                    <RegPeriodInfo />
                    <NoEventsAlert category={label} />
                    <AddEventButton addMarginTop />
                </div>
            </div>
        );
    }

    return (
        <div className={clsx(styles.card, 'card')}>
            <div className={clsx('card__header')}>
                <h3>{label}</h3>
            </div>
            <RegPeriodInfo />
            <EventsViewer
                events={events}
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
