import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';
import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import { Icon, SIZE_S } from '../../shared/icons';
import { mdiShareCircle } from '@mdi/js';

interface RowProps {
    event: EventModel;
    rowIndex: number;
}

const Event = observer((props: RowProps) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [ref]);

    const commonStyle = clsx(styles.cell, props.rowIndex % 2 === 0 ? styles.even : styles.odd)

    return (
        <>
            <div style={{gridColumn: 'kw'}} className={clsx(commonStyle, styles.kw)}>{event.kw}</div>
            <div style={{gridColumn: 'day'}} className={clsx(commonStyle, styles.day)}>{event.day}</div>
            <div style={{gridColumn: 'description'}} className={clsx(commonStyle, styles.description)}>{event.description}</div>
            <div style={{gridColumn: 'startDate'}} className={clsx(commonStyle, styles.startDate)}>{event.fStartDate}</div>
            <div style={{gridColumn: 'startTime'}} className={clsx(commonStyle, styles.startTime)}>{event.fStartTime}</div>
            <div style={{gridColumn: 'endDate'}} className={clsx(commonStyle, styles.endDate)}>{event.fEndDate}</div>
            <div style={{gridColumn: 'endTime'}} className={clsx(commonStyle, styles.endTime)}>{event.fEndTime}</div>
            <div style={{gridColumn: 'location'}} className={clsx(commonStyle, styles.location)}>{event.location}</div>
            <div style={{gridColumn: 'departments'}} className={clsx(commonStyle, styles.departments)}>{
                event.departmentNames.map((c, idx) => {
                    const badge = styles[c.toLowerCase()];
                    return (<Badge key={idx} text={c} className={badge} color={badge ? undefined : 'gray'} />);
                })
            }</div>
            <div style={{gridColumn: 'classes'}} className={clsx(commonStyle, styles.classes)}>{
                event.classes.map((c, idx) => {
                    return (<Badge key={idx} text={c} color="gray" />);
                })
            }</div>
            <div style={{gridColumn: 'descriptionLong'}} className={clsx(commonStyle, styles.descriptionLong)}>{
                event.descriptionLong
            }</div>
            <div style={{gridColumn: 'actions'}} className={clsx(commonStyle, styles.actions)}>
                <Button
                    icon={<Icon path={mdiShareCircle} color="blue" size={SIZE_S} />}
                    href={event.shareUrl}
                    target="_self"
                />
            </div>
        </>
    );
});

export default Event;