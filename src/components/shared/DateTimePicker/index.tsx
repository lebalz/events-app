
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';


interface Props {
    date: Date;
    onChange: (date: Date) => void;
}

const DateTimePicker = (props: Props) => {
    const date = new Date(props.date.getTime());
    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
    return (
        <div>
            <input 
                type={'datetime-local'} 
                value={date.toISOString().substring(0, 16)}
                onChange={(e) => {
                    const newDate = new Date(e.currentTarget.value);
                    newDate.setHours(newDate.getHours());
                    console.log(newDate);
                    props.onChange(newDate);
                }}
            />
        </div>
    )
};

export default DateTimePicker;