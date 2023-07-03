import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Button from '../../shared/Button';
import { mdiArrowExpandUp } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import { useStore } from '@site/src/stores/hooks';

interface Props extends ReadonlyProps {
    showFullName?: boolean;
    showRange?: boolean;
    showUnexpandButton?: boolean;
}
const Day = observer((props: Props) => {
    const { event, showFullName, showRange } = props;
    const start = showFullName ? event.dayFullStart : event.dayStart;
    const end = showFullName ? event.dayFullEnd : event.dayEnd;
    return (
        <div 
            style={{gridColumn: 'day'}} 
            className={clsx(styles.day, props.className, 'grid-day')}
        >
            <div className={clsx(styles.value, !showFullName && styles.abbrev)}>
                {(showRange && event.fStartDate !== event.fEndDate) ? `${start} - ${end}` : start}
            </div>
            {props.expandeable && props.showUnexpandButton && event.isExpanded && (
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