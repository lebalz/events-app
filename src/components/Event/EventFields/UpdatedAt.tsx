import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import { formatDate, formatDateTime, formatTime } from '@site/src/models/helpers/time';

interface Props extends DefaultProps {
    showAlways?: boolean;
    showTime?: boolean;
}

const UpdatedAt = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            className={clsx(props.className, styles.dateTime, styles.view)}
        >
            <div
                style={{ gridColumn: 'updatedAt' }}
                className={clsx(
                    styles.date, 
                    styles.updatedAt, 
                    event.isOnOneDay && styles.onOneDay,
                    !props.showTime && styles.dateOnly, 
                    'grid-updatedAt'
                )}
            >
                {
                    (props.showAlways || event.updatedAt.getTime() !== event.createdAt.getTime()) && (
                        <>
                            <span>{formatDate(event.updatedAt)}</span>
                            {props.showTime && <span>{formatTime(event.updatedAt)}</span>}
                        </>
                    )
                }
            </div>
        </div>
    )
});

export default UpdatedAt;