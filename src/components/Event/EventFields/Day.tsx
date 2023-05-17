import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';

const Day = observer((props: ReadonlyProps) => {
    const { styles } = props;
    return (
        <div 
            style={{gridColumn: 'day'}} 
            className={clsx(styles.day, props.className, 'grid-day')}
            onClick={() => props.event.setExpanded(true)}
        >
            {props.event.day}
        </div>
    )
});

export default Day;