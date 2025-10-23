import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';
import { translate } from '@docusaurus/Translate';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
    flexWrap?: boolean;
}

export const LINKED_USER_COLOR = 'var(--ifm-color-info-darkest)';

const LinkedUsers = observer((props: Props) => {
    const { event } = props;
    return (
        <div
            style={{ gridColumn: 'departments' }}
            className={clsx(
                props.className,
                styles.departments,
                'grid-departments',
                props.isEditGrid && styles.editGrid,
                (event.isExpanded || props.flexWrap) && styles.expanded
            )}
        >
            <div className={clsx(styles.tags)}>
                {event.linkedUserIds.size > 0 && (
                    <>
                        {event.linkedUsers.length > 0 ? (
                            event.linkedUsers.map((u, idx) => {
                                return (
                                    <Badge
                                        key={idx}
                                        text={u.displayName}
                                        title={u.email}
                                        color={LINKED_USER_COLOR}
                                        className={clsx(styles.badge)}
                                    />
                                );
                            })
                        ) : (
                            <Badge
                                text={translate(
                                    {
                                        id: 'event.linkedUserIds.size',
                                        message: '${count} Personen verknüpft',
                                        description: 'Badge text for linked users'
                                    },
                                    { count: event.linkedUserIds.size }
                                )}
                                title={translate(
                                    {
                                        id: 'event.linkedUserIds.size.title',
                                        message: 'Es sind ${count} Personen mit diesem Ereignis verknüpft.',
                                        description: 'Badge title for linked users'
                                    },
                                    { count: event.linkedUserIds.size }
                                )}
                                color={LINKED_USER_COLOR}
                                className={clsx(styles.badge)}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default LinkedUsers;
