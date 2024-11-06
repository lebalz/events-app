import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import sharedStyles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from '../iEventField';
import DateTimePicker from '@site/src/components/shared/DateTimePicker';
import Checkbox from '../../../shared/Checkbox';
import DatePicker from '../../../shared/DatePicker';
import { translate } from '@docusaurus/Translate';

interface Props extends DefaultProps {
    time: 'start' | 'end';
}

const Edit = observer((props: Props) => {
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    const error = event.errorFor(props.time);
    const dateColumn = `${props.time}Date`;
    const date = event[props.time];
    const datePickerId = date.toISOString().slice(0, 16);
    return (
        <div
            style={{ gridColumnStart: dateColumn, gridColumnEnd: `${props.time}End` }}
            className={clsx(
                props.className,
                'grid-dateTime',
                sharedStyles.dateTime,
                sharedStyles[props.time],
                error && sharedStyles.error
            )}
        >
            {event.showAsAllDay ? (
                <DatePicker
                    date={date}
                    onChange={(date) => {
                        const d = date.toISOString();
                        event.update({ [props.time]: d });
                    }}
                    time={props.time}
                    id={datePickerId}
                />
            ) : (
                <DateTimePicker
                    date={date}
                    onChange={(date) => {
                        const d = date.toISOString();
                        event.update({ [props.time]: d });
                    }}
                    id={datePickerId}
                />
            )}
            {props.time === 'start' && (
                <Checkbox
                    checked={event.showAsAllDay}
                    onChange={(checked) => {
                        event.setAllDay(checked);
                    }}
                    label={translate({
                        message: 'Ganztägig',
                        id: 'components.events.datetime.allday',
                        description: 'Label of the checkbox all day'
                    })}
                />
            )}
            {error && <div className={clsx(sharedStyles.errorMessage)}>{error.message}</div>}
        </div>
    );
});

export default Edit;
