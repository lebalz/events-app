import { default as EventModel } from '@site/src/models/Event';
import { clsx } from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';
import Badge from '../../shared/Badge';
import KW from './EventFields/Kw';
import Day from './EventFields/Day';
import Description from './EventFields/Description';
import DescriptionLong from './EventFields/DescriptionLong';
import Actions from './EventFields/Actions';
import DateTime from './EventFields/DateTime';
import Location from './EventFields/Location';
import Audience from './EventFields/Audience';
import Select from './EventFields/Select';

interface RowProps {
    event: EventModel;
    rowIndex: number;
    show: boolean;
    onSelect?: (selected: boolean, shiftKey: boolean) => void;
}

const Event = observer((props: RowProps) => {
    const { event } = props;

    const commonStyle = clsx(
        styles.cell, 
        event.isExpanded ? styles.expanded : styles.collapsed,
        props.rowIndex % 2 === 0 ? styles.even : styles.odd
    )
    if (!props.show) {
        return (
            <>
                <KW event={event} className={clsx(commonStyle)}/>
                <div style={{gridColumnStart: 'day', gridColumnEnd: 'gridEnd'}} className={clsx(commonStyle)}/>
            </>
        );
    }

    return (
        <React.Fragment>
            {props.onSelect && (
                <Select event={event} className={clsx(commonStyle)} onSelect={props.onSelect} />
            )}
            <KW event={event} className={clsx(commonStyle)}/>
            <Day event={event} className={clsx(commonStyle)}/>
            <Description event={event} className={clsx(commonStyle)} isEditable={true}/>
            <DateTime event={event} time='start' className={clsx(commonStyle)} isEditable={true} />
            <DateTime event={event} time='end' className={clsx(commonStyle)} isEditable={true} />
            <Location event={event} className={clsx(commonStyle)} isEditable={true} />
            <Audience event={event} className={clsx(commonStyle)} isEditable={true} />
            <DescriptionLong event={event} className={clsx(commonStyle)} isEditable={true}/>
            <Actions event={event} className={clsx(commonStyle)} />
        </React.Fragment>
    );
});

export default Event;