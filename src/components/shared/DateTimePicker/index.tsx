import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { isValidDate, toGlobalDate, toLocalDate } from '@site/src/models/helpers/time';
import { action } from 'mobx';

interface Props {
    date: Date;
    onChange: (date: Date) => void;
    /**
     * Optional id to force a rerender of the component
     * - this will refresh the date to the currently provided date
     * - this is useful if the date is changed from outside the component
     *   (and is not applied by default because an infinite update-cycle would be triggered otherwise)
     */
    id?: string;
}

const DateTimePicker = (props: Props) => {
    const [date, setDate] = React.useState<string>(toGlobalDate(props.date).toISOString().substring(0, 16));
    const [_id, _setId] = React.useState<string>(props.id);

    React.useEffect(
        action(() => {
            try {
                const newDate = new Date(date);
                props.onChange(toGlobalDate(newDate));
            } catch (e) {
                /** invalid date or time - ignore */
            }
        }),
        [date]
    );

    React.useEffect(() => {
        if (props.id !== _id) {
            _setId(props.id);
            setDate(toGlobalDate(props.date).toISOString().substring(0, 16));
        }
    }, [_id, props.id, props.date]);

    return (
        <div>
            <input
                className={clsx(styles.input)}
                type={'datetime-local'}
                value={date}
                max="2050-12-31T12:00"
                min="2023-01-01T12:00"
                onChange={(e) => {
                    if (isValidDate(new Date(e.currentTarget.value))) {
                        setDate(e.currentTarget.value);
                    }
                }}
            />
        </div>
    );
};

export default DateTimePicker;
