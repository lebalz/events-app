import Event from '@site/src/models/Event';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import DescriptionCell from '../shared/DescriptionCell';
import styles from './EventRow.module.scss';

interface RowProps {
    event: Event;
    onChange: (event: any, eventId: string) => void;
    locked: boolean;
}

const EditTD = observer(React.forwardRef((props: RowProps, ref?: React.RefObject<HTMLTableRowElement>) => {
    const { event } = props;
    return (
        <>
            <td>{event.kw}</td>
            <td>{event.weekday}</td>
            <DescriptionCell
                id={event.id}
                name="description"
                description={event.description}
                onChange={props.onChange}
                locked={props.locked}
            />
            <td style={{marginRight: '15px'}} colSpan={2}>
                <span>{event.fStartDate}</span>
            </td>
            <td>{event.location}</td>
            <td>
                {event.departmentNames.map((c, idx) => (
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
        </>
    );
}));

export default EditTD;