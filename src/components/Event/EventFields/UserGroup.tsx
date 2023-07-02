import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';


import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
}

const UserGroup = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            style={{ gridColumn: 'userGroup' }} 
            className={clsx(props.className, styles.userGroup)}
            onClick={(e) => event.setExpanded(!event.isExpanded)}
        >
            <div className={clsx(styles.tags)}>
                {event.hasUserGroup && (
                    <Badge text={event.userGroup?.name} color="blue" />
                )}
            </div>
        </div>
    )
});

export default UserGroup;