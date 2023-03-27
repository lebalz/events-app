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
                            <dt>Beschreibung</dt>
                            <dd>{event.descriptionLong}</dd>
                        </>
                    )}
                    <dt>KW</dt>
                    <dd>{event.kw}</dd>
                    <dt>Wochentag</dt>
                    <dd>{event.weekday}</dd>
                    <dt>Datum</dt>
                    <dd>{event.fStartDate} {event.fStartTime}</dd>
                    <dd><Icon path={mdiArrowRightBottom} />{event.fEndDate} {event.fEndTime}</dd>
                    <dt>Ort</dt>
                    <dd>{event.location}</dd>
                    {event.classes.length > 0 && (
                        <>
                            <dt>Klassen</dt>
                            <dd>{event.classes.map((cl, idx) => <Badge key={`cl-${idx}`} text={cl} />)}</dd>
                        </>
                    )}
                    {event.deparments.length > 0 && (
                        <>
                            <dt>Gruppen</dt>
                            <dd>{event.deparments.map((dp, idx) => <Badge key={`gr-${idx}`} text={dp.name} />)}</dd>
                        </>
                    )}
                    {event.affectedLessons.length > 0 && (
                        <>
                            <dt>Betroffene Lektionen</dt>
                            <dd>
                                <DefinitionList>
                                    {event.affectedLessons.map((kl, idx) => (
                                            <React.Fragment key={`kl-${idx}`}>
                                                <dt >{kl.class}</dt>
                                                {kl.lessons.map((l, iidx) => (
                                                    <dd key={`kl-${idx}-${iidx}`}>{l.subject} | {l.startHHMM}-{l.endHHMM} | {l.teachers.map(t => t.shortName).join(', ')}</dd>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    
                                </DefinitionList>
                            </dd>
                        </>
                    )}
                </DefinitionList>
            </div>
        </div>
    )
});

export default Event;