import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
    flexWrap?: boolean;
}

const Departments = observer((props: Props) => {
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
                {
                    event.affectedDepartments.map((d, idx) => {
                        return (
                            <Badge 
                                key={idx} 
                                text={d.shortName}
                                title={d.description}
                                color={d.color}
                                className={clsx(styles.badge)}
                            />
                        );
                    })
                }
            </div>
        </div>
    )
});

export default Departments;