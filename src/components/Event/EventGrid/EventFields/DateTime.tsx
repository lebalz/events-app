import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import DateTimePicker from '@site/src/components/shared/DateTimePicker';

interface Props extends DefaultProps{
    time: 'start' | 'end'
}

const DateTime = observer((props: Props) => {
    const {event} = props;
    let dateColumn = 'startDate';
    let timeColumn = 'startTime';
    let date = event.start;
    let fdate = event.fStartDate;
    let ftime = event.fStartTime;
    if (props.time === 'end') {
        dateColumn = 'endDate';
        timeColumn = 'endTime';
        fdate = event.fEndDate;
        ftime = event.fEndTime;
        date = event.end;
    }
    if (props.isEditable && props.event.editing) {
        return (
            <div
                style={{gridColumnStart: dateColumn, gridColumnEnd: `${props.time}End`}} 
                className={clsx(props.className, styles.dateTime, styles[props.time])}
            >
                <DateTimePicker
                    date={date}
                    onChange={(date) => event.update({[props.time]: date.toISOString()})}
                />
            </div>
        )
    }
    return (
        <>
            <div 
                style={{gridColumn: dateColumn}} 
                className={clsx(props.className, styles[dateColumn])}
            >{
                fdate
            }</div>
            <div 
                style={{gridColumn: timeColumn}} 
                className={clsx(props.className, styles[timeColumn])}
            >{
                ftime
            }</div>
        </>
    )
});

export default DateTime;