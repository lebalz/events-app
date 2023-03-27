import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Button from '../shared/Button';
import { mdiPlusCircleOutline } from '@mdi/js';
import { Icon, SIZE } from '../shared/icons';
import {default as EventModel} from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
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
                    <dt>Von</dt>
                    <dd>{event.weekday} {event.fStartDate} {event.fStartTime}</dd>
                    <dt>Bis</dt>
                    <dd>{event.fEndDate} {event.fEndTime}</dd>
                    <dt>Ort</dt>
                    <dd>{event.location}</dd>
                    {event.classes.length > 0 && (
                        <>
                            <dt>Klassen</dt>
                            <dd>{event.classes.map((cl) => <Badge text={cl} />)}</dd>
                        </>
                    )}
                    {event.deparments.length > 0 && (
                        <>
                            <dt>Gruppen</dt>
                            <dd>{event.deparments.map((dp) => <Badge text={dp.name} />)}</dd>
                        </>
                    )}
                </DefinitionList>
            </div>
        </div>
    )
});

export default Event;