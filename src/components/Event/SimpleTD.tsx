import SchoolEvent from '@site/src/models/SchoolEvent';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import styles from './EventRow.module.scss';
import React from 'react';

interface RowProps {
    event: SchoolEvent;
    locked: boolean;
}

const SimpleTD = observer(React.forwardRef((props: RowProps, ref?: React.RefObject<HTMLTableRowElement>) => {
    const { event } = props;
    return (
        <>
            <td>{event.kw}</td>
            <td>{event.weekday}</td>
            <td>{event.description}</td>
            <td>{`${event.startDate} ${event.startTime}`}</td>
            <td>{`${event.endDate} ${event.endTime}`}</td>
            <td>{event.location}</td>
            <td>{event.departments.map((c, idx) => (
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
            <td>{event.classes.map((c, idx) => (
                <span
                    key={idx}
                    className={clsx(
                        'badge',
                        'badge--secondary'
                    )}
                >
                    {c}
                </span>
            ))
            }</td>
            <td>{event.descriptionLong}</td>
        </>
    );
}));

export default SimpleTD;