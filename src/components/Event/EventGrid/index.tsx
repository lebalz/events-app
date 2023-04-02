import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Event from './Event';
import {default as EventModel} from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import EventHeader from './EventHeader';


interface Props {
    events: EventModel[];
}

const EventGrid = observer((props: Props) => {

    return (
        <div className={clsx(styles.scroll)}>
            <div className={clsx(styles.grid)}>
                <EventHeader />
                {props.events.map((event, idx) => (
                    <Event key={event.id} rowIndex={idx} event={event} />
                ))}
            </div>
        </div>
    )
});

export default EventGrid;