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

interface RowProps {
    event: EventModel;
    rowIndex: number;
    hideActions: boolean;
    show: boolean;
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
            <KW event={event} className={clsx(commonStyle)}/>
            <Day event={event} className={clsx(commonStyle)}/>
            <Description event={event} className={clsx(commonStyle)} isEditable={true}/>
            <DateTime event={event} time='start' className={clsx(commonStyle)} isEditable={true} />
            <DateTime event={event} time='end' className={clsx(commonStyle)} isEditable={true} />
            <Location event={event} className={clsx(commonStyle)} isEditable={true} />
            <div 
                style={{gridColumn: 'departments'}} 
                className={clsx(commonStyle, styles.departments)}
            >{
                event.departmentNames.map((c, idx) => {
                    const badge = styles[c.toLowerCase()];
                    return (<Badge key={idx} text={c} className={badge} color={badge ? undefined : 'gray'} />);
                })
            }</div>
            <div style={{gridColumn: 'classes'}} className={clsx(commonStyle, styles.classes)}>{
                event.fClasses.map((c, idx) => {
                    return (<Badge key={idx} text={c} color="gray" />);
                })
            }</div>
            <DescriptionLong event={event} className={clsx(commonStyle)} isEditable={true}/>
            <Actions event={event} className={clsx(commonStyle)} hideActions={props.hideActions} />
        </React.Fragment>
    );
});

export default Event;