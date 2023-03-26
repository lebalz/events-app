import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Edit from '../../shared/Button/Edit';
import styles from './EventRow.module.scss';

interface RowProps {
    event: Event;
    locked: boolean;
    editMode: boolean;
}

const EventRow = observer((props: RowProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    const { event } = props;
    return (
        <tr
            data-id={event.id}
            onClick={() => {
                if (!expanded) {
                    setExpanded(true);
                }
            }}
            onBlur={() => {
                setExpanded(false);
            }}
            className={clsx(styles.eventRow, expanded && styles.expanded, props.editMode && styles.editMode)}
        >
            <td className={clsx(styles.kw)}>{event.kw}</td>
            <td className={clsx(styles.weekday)}>{event.weekday}</td>
            <td style={{maxWidth: eventTable.maxWidthDescription}} className={clsx(styles.description)}>{event.description}</td>
            <td className={clsx(styles.startDate)}>{event.fStartDate}</td>
            <td className={clsx(styles.startTime)}>{event.fStartTime}</td>
            <td className={clsx(styles.endDate)}>{event.fEndDate}</td>
            <td className={clsx(styles.endTime)}>{event.fEndTime}</td>
            <td 
                className={clsx(styles.location)} 
                style={{maxWidth: eventTable.maxWidthLocation}}
            >
                {event.location}
            </td>
            <td className={clsx(styles.departmentNames)}>{event.departmentNames.map((c, idx) => (
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
            <td className={clsx(styles.classes)}>{event.classes.map((c, idx) => (
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
            <td 
                className={clsx(styles.descriptionLong)}
                style={{maxWidth: eventTable.maxWidthDescriptionLong}}
            >
                {event.descriptionLong}
            </td>
            {
                event.isEditable && (
                    <td>
                        <Edit onClick={() => event.setEditing(true)} />
                    </td>
                )
            }
        </tr>
    );
});

export default EventRow;