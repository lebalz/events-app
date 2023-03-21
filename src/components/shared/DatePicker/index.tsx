
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate } from '@site/src/models/helpers/time';


interface Props {
    date: Date;
    onChange: (date: Date) => void;
}

const DatePicker = (props: Props) => {
    const date = props.date.toISOString().substring(0, 10);
    return (
        <div>
            <input 
                type={'date'} 
                value={date}
                onChange={(e) => {
                    const newDate = new Date(e.currentTarget.value);
                    props.onChange(toGlobalDate(newDate));
                }}
            />
        </div>
    )
};

export default DatePicker;