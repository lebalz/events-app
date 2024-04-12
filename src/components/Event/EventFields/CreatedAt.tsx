import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import { formatDate, formatDateTime, formatTime } from '@site/src/models/helpers/time';

interface Props extends DefaultProps {
    showTime?: boolean;
}

const CreatedAt = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            className={clsx(props.className, styles.dateTime, styles.view)}
        >
            <div
                style={{ gridColumn: 'createdAt' }}
                className={clsx(
                    styles.date, 
                    styles.createdAt, 
                    event.isOnOneDay && styles.onOneDay,
                    !props.showTime && styles.dateOnly, 
                    'grid-createdAt'
                )}
            >
                <span>{formatDate(event.createdAt)}</span>
                {props.showTime && <span>{formatTime(event.createdAt)}</span>}
            </div>
        </div>
    )
});

export default CreatedAt;