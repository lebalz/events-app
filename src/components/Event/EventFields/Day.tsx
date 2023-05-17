import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Button from '../../shared/Button';
import { mdiArrowExpandUp } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';

const Day = observer((props: ReadonlyProps) => {
    const { styles, event } = props;
    return (
        <div 
            style={{gridColumn: 'day'}} 
            className={clsx(styles.day, props.className, 'grid-day')}
            onClick={() => props.expandeable && event.setExpanded(true)}
        >
            <div className={clsx(styles.value)}>
                {event.day}
            </div>
            {props.expandeable && event.isExpanded && (
                <div className={clsx(styles.expand)}>
                    <Button icon={mdiArrowExpandUp} onClick={(e) => {
                        e.stopPropagation();
                        event.setExpanded(false);
                    }} size={SIZE_S} />
                </div>
            )}
        </div>
    )
});

export default Day;