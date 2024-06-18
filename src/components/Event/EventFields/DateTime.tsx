import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import DateTimePicker from '@site/src/components/shared/DateTimePicker';
import Checkbox from '../../shared/Checkbox';
import DatePicker from '../../shared/DatePicker';
import { translate } from '@docusaurus/Translate';

interface Props extends DefaultProps {
    time: 'start' | 'end';
}

const DateTime = observer((props: Props) => {
    const { event } = props;
    const error = event.errorFor(props.time);
    let dateColumn = 'startDate';
    let timeColumn = 'startTime';
    let date = event.start;
    let fdate = event.fStartDate;
    let ftime = event.fStartTime;
    let datePickerId = event.end.toISOString().slice(0, 16);
    if (props.time === 'end') {
        dateColumn = 'endDate';
        timeColumn = 'endTime';
        fdate = event.fEndDate;
        ftime = event.fEndTime;
        date = event.end;
        datePickerId = event.start.toISOString().slice(0, 16);
    }
    if (event.isEditable && event.isEditing) {
        return (
            <div
                style={{ gridColumnStart: dateColumn, gridColumnEnd: `${props.time}End` }}
                className={clsx(
                    props.className,
                    'grid-dateTime',
                    styles.dateTime,
                    styles[props.time],
                    error && styles.error
                )}
            >
                {event.showAsAllDay ? (
                    <DatePicker
                        date={date}
                        onChange={(date) => {
                            const d = date.toISOString();
                            event.update({ [props.time]: d });
                        }}
                        time={props.time}
                        id={datePickerId}
                    />
                ) : (
                    <DateTimePicker
                        date={date}
                        onChange={(date) => {
                            const d = date.toISOString();
                            event.update({ [props.time]: d });
                        }}
                        id={datePickerId}
                    />
                )}
                {props.time === 'start' && (
                    <Checkbox
                        checked={event.showAsAllDay}
                        onChange={(checked) => {
                            event.setAllDay(checked);
                        }}
                        label={translate({
                            message: 'Ganztägig',
                            id: 'components.events.datetime.allday',
                            description: 'Label of the checkbox all day'
                        })}
                    />
                )}
                {error && <div className={clsx(styles.errorMessage)}>{error.message}</div>}
            </div>
        );
    }
    return (
        <div className={clsx(props.className, styles.dateTime, styles.view)}>
            <div
                style={{ gridColumn: dateColumn }}
                className={clsx(
                    styles.date,
                    styles[dateColumn],
                    event.isOnOneDay && styles.onOneDay,
                    `grid-${dateColumn}`
                )}
            >
                {fdate}
            </div>
            {!event.isAllDay && (
                <div
                    style={{ gridColumn: timeColumn }}
                    className={clsx(styles.time, styles[timeColumn], `grid-${timeColumn}`)}
                >
                    {ftime}
                </div>
            )}
        </div>
    );
});

export const StartDateTime = observer((props: DefaultProps) => {
    return <DateTime {...props} time="start" />;
});
export const EndDateTime = observer((props: DefaultProps) => {
    return <DateTime {...props} time="end" />;
});

export default DateTime;
