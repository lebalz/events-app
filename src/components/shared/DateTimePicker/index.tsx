
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate } from '@site/src/models/helpers/time';
import { action } from 'mobx';


interface Props {
    date: Date;
    onChange: (date: Date) => void;
}

const DateTimePicker = (props: Props) => {
    const [date, setDate] = React.useState<string>(toGlobalDate(props.date).toISOString().substring(0, 16));

    React.useEffect(action(() => {
        try {
            const newDate = new Date(date);
            props.onChange(toGlobalDate(newDate));
        } catch (e) {
            console.error(e);
        }
    }), [date]);

    return (
        <div>
            <input 
                type={'datetime-local'} 
                value={date}
                max="2099-12-31T00:01"
                min="2020-01-01T23:59"
                onChange={(e) => {
                    setDate(e.currentTarget.value);
                }}
            />
        </div>
    )
};

export default DateTimePicker;