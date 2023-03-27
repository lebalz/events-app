import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import {default as EventModel} from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiAccountGroup, mdiArrowRightBottom, mdiCalendarClock, mdiCalendarExpandHorizontal, mdiCalendarRange, mdiCalendarToday, mdiCalendarWeek, mdiCardText, mdiCrosshairsGps, mdiHomeGroup, mdiOfficeBuilding } from '@mdi/js';
import { Icon } from '../shared/icons';
interface Props {
    event: EventModel;
}

const Event = observer((props: Props) => {
    const {event} = props;
    return (
        <div className={clsx(styles.event, 'card')}>
            <div className={clsx('card__header')}>
                <h3>{event.description}</h3>
            </div>
            <div className={clsx('card__body')}>
                <DefinitionList>
                    <dt>Titel</dt>
                    <dd>{event.description}</dd>
                    {event.descriptionLong && (
                        <>
                            <dt><Badge text="Beschreibung" icon={mdiCardText} iconSide="left" /></dt>
                            <dd>{event.descriptionLong}</dd>
                        </>
                    )}
                    <dt><Badge text="KW" icon={mdiCalendarWeek} iconSide="left" /></dt>
                    <dd>{event.kw}</dd>
                    <dt><Badge text="Wochentag" icon={mdiCalendarToday} iconSide="left" /></dt>
                    <dd>{event.weekday}</dd>
                    <dt><Badge text="Von" icon={mdiCalendarClock} iconSide="left" /></dt>
                    <dd>{event.fStartDate} {event.fStartTime}</dd>
                    <dd><Icon path={mdiArrowRightBottom} />{event.fEndDate} {event.fEndTime}</dd>
                    <dt><Badge text="Ort" icon={mdiCrosshairsGps} iconSide="left" /></dt>
                    <dd>{event.location}</dd>
                    {event.classes.length > 0 && (
                        <>
                            <dt><Badge text="Klassen" icon={mdiAccountGroup} iconSide="left" /></dt>
                            <dd>{event.classes.map((cl) => <Badge text={cl} />)}</dd>
                        </>
                    )}
                    {event.deparments.length > 0 && (
                        <>
                            <dt><Badge text="Gruppen" icon={mdiOfficeBuilding} iconSide="left" /></dt>
                            <dd>{event.deparments.map((dp) => <Badge text={dp.name} />)}</dd>
                        </>
                    )}
                </DefinitionList>
            </div>
        </div>
    )
});

export default Event;