import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import { formatDateTime } from '@site/src/models/helpers/time';

interface Props extends DefaultProps {
}

const CreatedAt = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            className={clsx(props.className, styles.dateTime, styles.view)}
        >
            <div
                style={{ gridColumn: 'createdAt' }}
                className={clsx(styles.date, styles.createdAt, event.isOnOneDay && styles.onOneDay, `grid-createdAt`)}
            >
                {formatDateTime(event.createdAt)}
            </div>
        </div>
    )
});

export default CreatedAt;