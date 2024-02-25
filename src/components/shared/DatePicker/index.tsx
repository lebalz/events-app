
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate, toLocalDate } from '@site/src/models/helpers/time';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';


interface Props {
    date: Date;
    time: 'start' | 'end';
    onChange: (date: Date) => void;
    disabled?: boolean;
    /**
     * Optional id to force a rerender of the component
     * - this will refresh the date to the currently provided date
     * - this is useful if the date is changed from outside the component
     *   (and is not applied by default because an infinite update-cycle would be triggered otherwise)
     */
    id?: string;
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

const DatePicker = observer((props: Props) => {
    const [date, setDate] = React.useState<string>(initDate(props.date, props.time).toISOString().substring(0, 10));
    const [_id, _setId] = React.useState<string>(props.id);

    React.useEffect(action(() => {
        try {
            props.onChange(toDate(date, props.time));
        } catch (e) {
            /** invalid date - ignore */
        }
    }), [date, props.time]);
    
    React.useEffect(() => {
        if (props.id !== _id) {
            _setId(props.id);
            setDate(initDate(props.date, props.time).toISOString().substring(0, 10));
        }
    }, [_id, props.id, props.date, props.time]);

    return (
        <div>
            <input 
                type={'date'} 
                value={date}
                disabled={props.disabled}
                onChange={(e) => {
                    setDate(e.currentTarget.value);
                }}
            />
        </div>
    )
});

export default DatePicker;