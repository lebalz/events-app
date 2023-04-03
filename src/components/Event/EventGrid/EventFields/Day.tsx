import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';

const Day = observer((props: ReadonlyProps) => {
    return (
        <div 
            style={{gridColumn: 'day'}} 
            className={clsx(styles.day, props.className)}
        >
            {props.event.day}
        </div>
    )
});

export default Day;