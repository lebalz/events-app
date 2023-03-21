
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate } from '@site/src/models/helpers/time';


interface Props {
    date: Date;
    onChange: (date: Date) => void;
}

const DateTimePicker = (props: Props) => {
    return (
        <div>
            <input 
                type={'datetime-local'} 
                value={toGlobalDate(props.date).toISOString().substring(0, 16)}
                onChange={(e) => {
                    const newDate = new Date(e.currentTarget.value);
                    props.onChange(toGlobalDate(newDate));
                }}
            />
        </div>
    )
};

export default DateTimePicker;