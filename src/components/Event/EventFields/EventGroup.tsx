import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';


import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import EventsGroupPopup from '../../EventGroup/EventsGroupPopup';
import { mdiTagEditOutline } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import Button from '../../shared/Button';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
}

const EventGroup = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            style={{ gridColumn: 'userGroup' }} 
            className={clsx(props.className, styles.userGroup, event.isExpanded && styles.expanded)}
        >
            <div className={clsx(styles.tags)}>
                <EventsGroupPopup 
                    event={event}
                    trigger={<Button 
                        text={`${event.groups.length}`}
                        icon={mdiTagEditOutline} 
                        size={SIZE_S}
                    />}
                />
            </div>
        </div>
    )
});

export default EventGroup;