
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate } from '@site/src/models/helpers/time';
import { action } from 'mobx';


interface Props {
    date: Date;
    onChange: (date: Date) => void;
    type: 'date' | 'datetime';
    // dayOffset: number;
}

const MIN_DATE = '2020-01-01';
const MAX_DATE = '2099-12-31';
const MIN_DATE_TIME = `${MIN_DATE}T00:00`;
const MAX_DATE_TIME = `${MAX_DATE}T23:59`;

const DateTimePicker = (props: Props) => {
    const [date, setDate] = React.useState<string>('');
    const [iType, setIType] = React.useState<'date' | 'datetime'>(props.type);
    React.useEffect(() => {
        setDate(toGlobalDate(props.date).toISOString().substring(0, 16));
    }, []);

    React.useEffect(action(() => {
        try {
            const newDate = new Date(date);
            props.onChange(toGlobalDate(newDate));
        } catch (e) {
            /** invalid date or time - ignore */
        }
    }), [date]);

    if (!date) {
        return null;
    }

    return (
        <div>
            {
                props.type === 'datetime' ? (
                    <input 
                        className={clsx(styles.input)}
                        type={'datetime-local'}
                        value={date}
                        max={MAX_DATE_TIME}
                        min={MIN_DATE_TIME}
                        onChange={(e) => {
                            setDate(e.currentTarget.value);
                        }}
                    />
                ) : (
                    <input 
                        className={clsx(styles.input)}
                        type={'date'}
                        value={date.substring(0, 10)}
                        max={MAX_DATE}
                        min={MIN_DATE}
                        onChange={(e) => {
                            setDate(`${e.currentTarget.value}T00:00`);
                        }}
                    />
                )
            }
        </div>
    )
};

export default DateTimePicker;