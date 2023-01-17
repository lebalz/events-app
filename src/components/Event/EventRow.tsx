import SchoolEvent from '@site/src/models/SchoolEvent';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import DescriptionCell from '../shared/DescriptionCell';
import styles from './EventRow.module.scss';

interface RowProps {
    event: SchoolEvent;
    onChange: (event: any, eventId: string) => void;
    locked: boolean;
}

const EventRow = observer((props: RowProps) => {
    const { event } = props;
    return (
        <tr>
            <td>{event.kw}</td>
            <td>{event.weekday}</td>
            <DescriptionCell
                id={event.id}
                name="description"
                description={event.description}
                onChange={props.onChange}
                locked={props.locked}
            />
            <td>{event.startDate}</td>
            <td>{event.allDay ? '' : event.startTime}</td>
            <td>{event.allDay && event.startDate === event.endDate ? '' : event.endDate}</td>
            <td>{event.allDay ? '' : event.endTime}</td>
            <td>{event.location}</td>
            <td>
                {event.departements.map((c, idx) => (
                    <span
                        key={idx}
                        className={clsx(
                            'badge',
                            'badge--primary',
                            styles.badge,
                            styles[c.toLowerCase()]
                        )}
                    >
                        {c}
                    </span>
                ))}
            </td>
            <td>
                {event.classes.map((c, idx) => (
                    <span
                        key={idx}
                        className={clsx(
                            'badge',
                            'badge--secondary'
                        )}
                    >
                        {c}
                    </span>
                ))}
            </td>
            <DescriptionCell
                id={event.id}
                name="descriptionLong"
                description={event.descriptionLong}
                onChange={props.onChange}
                locked={props.locked}
            />
        </tr>
    );
});

export default EventRow;