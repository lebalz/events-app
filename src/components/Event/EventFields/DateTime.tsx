import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import DateTimePicker from '@site/src/components/shared/DateTimePicker';
import Checkbox from '../../shared/Checkbox';

interface Props extends DefaultProps {
    time: 'start' | 'end'
}

const DateTime = observer((props: Props) => {
    const { event } = props;
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
    if (event.isEditable && event.isEditing) {
        return (
            <div
                style={{ gridColumnStart: dateColumn, gridColumnEnd: `${props.time}End` }}
                className={clsx(props.className, 'grid-dateTime', styles.dateTime, styles[props.time], error && styles.error)}
            >
                <DateTimePicker
                    date={date}
                    onChange={(date) => {
                        const d = date.toISOString();
                        event.update({ [props.time]: d })
                    }}
                    type={event.allDay ? 'date' : 'datetime'}
                />
                {props.time === 'start' && (
                    <Checkbox
                        checked={event.allDay}
                        onChange={(checked) => {
                            event.setAllDay(checked);
                        }}
                        label='Ganztägig'
                    />
                )}
                {error && (
                    <div className={styles.errorMessage}>
                        {error.message}
                    </div>
                )}
            </div>
        )
    }
    return (
        <div 
            className={clsx(props.className, styles.dateTime, styles.view)}
        >
            <div
                style={{ gridColumn: dateColumn }}
                className={clsx(styles.date, styles[dateColumn], event.isOnOneDay && styles.onOneDay, `grid-${dateColumn}`)}
            >
                {fdate}
            </div>
            <div
                style={{ gridColumn: timeColumn }}
                className={clsx(styles.time, styles[timeColumn], event.isAllDay && styles.allDay, `grid-${timeColumn}`)}
            >
                {ftime}
            </div>
        </div>
    )
});

export const StartDateTime = observer((props: DefaultProps) => {
    return (
        <DateTime
            {...props}
            time='start'
        />
    )
});
export const EndDateTime = observer((props: DefaultProps) => {
    return (
        <DateTime
            {...props}
            time='end'
        />
    )
});

export default DateTime;