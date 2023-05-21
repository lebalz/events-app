
import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { toGlobalDate } from '@site/src/models/helpers/time';
import { action } from 'mobx';


interface Props {
    date: Date;
    onChange: (date: Date) => void;
}

const DatePicker = (props: Props) => {
    const [date, setDate] = React.useState<string>(toGlobalDate(props.date).toISOString().substring(0, 10));
    React.useEffect(action(() => {
        try {
            const newDate = new Date(date);
            props.onChange(toGlobalDate(newDate));
        } catch (e) {
            /** invalid date - ignore */
        }
    }), [date]);
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