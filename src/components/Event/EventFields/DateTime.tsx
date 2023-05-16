import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import DateTimePicker from '@site/src/components/shared/DateTimePicker';

interface Props extends DefaultProps {
    time: 'start' | 'end'
}

const DateTime = observer((props: Props) => {
    const { event, styles } = props;
    const error = event.errorFor(props.time);
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
    console.log(props.styles)
    if (props.isEditable && props.event.isEditing) {
        return (
            <div
                style={{ gridColumnStart: dateColumn, gridColumnEnd: `${props.time}End` }}
                className={clsx(props.className, 'grid-dateTime', styles.dateTime, styles[props.time], error && styles.error)}
            >
                <DateTimePicker
                    date={date}
                    onChange={(date) => event.update({ [props.time]: date.toISOString() })}
                />
                {error && (
                    <div className={styles.errorMessage}>
                        {error.message}
                    </div>
                )}
            </div>
        )
    }
    return (
        <>
            <div
                style={{ gridColumn: dateColumn }}
                className={clsx(props.className, styles.date, styles[dateColumn], `grid-${dateColumn}`)}
            >{
                    fdate
                }</div>
            <div
                style={{ gridColumn: timeColumn }}
                className={clsx(props.className, styles.time, styles[timeColumn], `grid-${timeColumn}`)}
            >{
                    ftime
                }</div>
        </>
    )
});

export default DateTime;