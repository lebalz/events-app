import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ClassLinker from './ClassSelector';
import styles from './EventRow.module.scss';

interface RowProps {
    event: Event;
    locked: boolean;
}

const EventRow = observer(React.forwardRef((props: RowProps, ref?: React.RefObject<HTMLTableRowElement>) => {
    const [expanded, setExpanded] = React.useState(false);
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    const { event } = props;
    return (
        <tr
            ref={ref}
            data-id={event.id}
            onClick={() => {
                if (!expanded) {
                    setExpanded(true);
                }
            }}
            onBlur={() => {
                setExpanded(false);
            }}
            className={clsx(styles.eventRow, expanded && styles.expanded)}
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
                        <button
                            className={clsx('button', 'button--danger')}
                            onClick={() => {
                                event.destroy();
                            }}
                        >
                            Löschen
                        </button>
                    </td>
                )
            }
            {
                event.isEditable && (
                    <td style={{minWidth: '300px'}}>
                        <ClassLinker eventId={event.id} />
                    </td>
                )
            }
            {
                event.isEditable && event.isDirty && (
                    <td>
                        <button
                            className={clsx('button', 'button--primary')}
                            onClick={() => {
                                event.save();
                            }}
                        >
                            Save
                        </button>
                    </td>
                )
            }
        </tr>
    );
}));

export default EventRow;