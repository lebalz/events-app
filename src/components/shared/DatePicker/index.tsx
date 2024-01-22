
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate, toLocalDate } from '@site/src/models/helpers/time';
import { action } from 'mobx';


interface Props {
    date: Date;
    time: 'start' | 'end';
    onChange: (date: Date) => void;
}

const toDate = (date: Date | string, time: 'start' | 'end') => {
    const newDate = new Date(date);
    if (time === 'start') {
        newDate.setUTCHours(0, 0, 0, 0);
    } else {
        newDate.setUTCHours(24, 0, 0, 0);
    }
    return newDate;
}

const initDate = (date: Date, time: 'start' | 'end') => {
    if (time === 'start') {
        return toGlobalDate(new Date(date));
    }
    /**
     * ICS: 1.1.2024 at 24:00 is considered a full day for ics files.
     * JS:  2.1.2024 at 00:00 is the start of the day...
     * Solution: subtract 1 ms and take the according day as the reference...
     */
    const newDate = new Date(toGlobalDate(new Date(date)).getTime() - 1);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
}

const DatePicker = (props: Props) => {
    const [date, setDate] = React.useState<string>(initDate(props.date, props.time).toISOString().substring(0, 10));
    React.useEffect(action(() => {
        try {
            props.onChange(toDate(date, props.time));
        } catch (e) {
            /** invalid date - ignore */
        }
    }), [date, props.time]);
    return (
        <div>
            <input 
                type={'date'} 
                value={date}
                onChange={(e) => {
                    setDate(e.currentTarget.value);
                }}
            />
        </div>
    )
};

export default DatePicker;