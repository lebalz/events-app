import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ViewGroup } from '.';
import { formatDate } from '@site/src/models/helpers/time';


interface Props extends ViewGroup {
    isCurrent?: boolean;
}


const Group = observer((props: Props) => {
    const {events} = props;
    if (events.length === 0) {
        return null;
    }
    return (
        <div
            key={`group-${props.group}`}
            className={clsx(styles.group, props.isCurrent && styles.current)}
            style={{
                gridColumn: '1 / -1',
            }} 
        >
            <span>KW {props.group}</span>
            <span>{formatDate(events[0].weekStart)} - {formatDate(events[0].weekEnd)}</span>
        </div>
    )
});

export default Group;