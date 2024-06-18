import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import EventsGroupPopup from '../../EventGroup/EventsGroupPopup';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const EventGroup = observer((props: Props) => {
    const { event } = props;
    return (
        <div
            style={{ gridColumn: 'userGroup' }}
            className={clsx(props.className, styles.userGroup, event.isExpanded && styles.expanded)}
        >
            <div className={clsx(styles.tags)}>
                <EventsGroupPopup event={event} />
            </div>
        </div>
    );
});

export default EventGroup;
