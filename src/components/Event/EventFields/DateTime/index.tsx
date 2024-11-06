import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import sharedStyles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from '../iEventField';
import Edit from './Edit';

interface Props extends DefaultProps {
    time: 'start' | 'end';
}

const DateTime = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    const dateColumn = `${props.time}Date`;
    const timeColumn = `${props.time}Time`;
    const fdate = props.time === 'start' ? event.fStartDate : event.fEndDate;
    const ftime = props.time === 'start' ? event.fStartTime : event.fEndTime;
    return (
        <div className={clsx(props.className, sharedStyles.dateTime, sharedStyles.view)}>
            <div
                style={{ gridColumn: dateColumn }}
                className={clsx(
                    sharedStyles.date,
                    sharedStyles[dateColumn],
                    event.isOnOneDay && sharedStyles.onOneDay,
                    `grid-${dateColumn}`
                )}
            >
                {fdate}
            </div>
            {!event.isAllDay && (
                <div
                    style={{ gridColumn: timeColumn }}
                    className={clsx(sharedStyles.time, sharedStyles[timeColumn], `grid-${timeColumn}`)}
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
