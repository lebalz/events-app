import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as DefaultProps } from './iEventField';
import { formatDateTime } from '@site/src/models/helpers/time';

interface Props extends DefaultProps {
}

const UpdatedAt = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            className={clsx(props.className, styles.dateTime, styles.view)}
        >
            <div
                style={{ gridColumn: 'updatedAt' }}
                className={clsx(styles.date, styles.createdAt, event.isOnOneDay && styles.onOneDay, `grid-updatedAt`)}
            >
                {formatDateTime(event.updatedAt)}
            </div>
        </div>
    )
});

export default UpdatedAt;