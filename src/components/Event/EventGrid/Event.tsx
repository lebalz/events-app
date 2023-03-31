import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';
import Badge from '../../shared/Badge';

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
            <div className={clsx(commonStyle, styles.kw)}>{event.kw}</div>
            <div className={clsx(commonStyle, styles.day)}>{event.day}</div>
            <div className={clsx(commonStyle, styles.description)}>{event.description}</div>
            <div className={clsx(commonStyle, styles.startDate)}>{event.fStartDate}</div>
            <div className={clsx(commonStyle, styles.startTime)}>{event.fStartTime}</div>
            <div className={clsx(commonStyle, styles.endDate)}>{event.fEndDate}</div>
            <div className={clsx(commonStyle, styles.endTime)}>{event.fEndTime}</div>
            <div className={clsx(commonStyle, styles.location)}>{event.location}</div>
            <div className={clsx(commonStyle, styles.departments)}>{
                event.departmentNames.map((c, idx) => {
                    const badge = styles[c.toUpperCase()];
                    return (<Badge key={idx} text={c} className={badge} color={badge ? undefined : 'gray'} />);
                })
            }</div>
            <div className={clsx(commonStyle, styles.classes)}>{
                event.classes.map((c, idx) => {
                    return (<Badge key={idx} text={c} color="gray" />);
                })
            }</div>
            <div className={clsx(commonStyle, styles.descriptionLong)}>{
                event.descriptionLong
            }</div>
        </>
    );
});

export default Event;