import { mdiShareCircle } from '@mdi/js';
import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Button from '../../shared/Button';
import Copy from '../../shared/Button/Copy';
import Edit from '../../shared/Button/Edit';
import { Icon, SIZE_S } from '../../shared/icons';
import styles from './EventRow.module.scss';
import siteConfig from '@generated/docusaurus.config';

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
            {
                event.isPublic && (
                    <td>
                        <Copy
                            value={`${siteConfig.customFields.DOMAIN}${event.shareUrl}`} 
                            size={SIZE_S}
                        />
                    </td>
                )
            }
            <td>
                <Button
                    icon={<Icon path={mdiShareCircle} color="blue" size={SIZE_S} />}
                    href={event.shareUrl}
                    target="_self"
                />
            </td>
        </tr>
    );
});

export default EventRow;