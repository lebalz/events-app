import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
}

const Departments = observer((props: Props) => {
    const { event, onClick } = props;
    return (
        <div
            style={{ gridColumn: 'departments' }}
            className={clsx(props.className, styles.departments, 'grid-departments', props.isEditGrid && styles.editGrid)}
            onClick={onClick}
        >
            <div className={clsx(styles.tags)}>
                {
                    event.affectedDepartments.map((d, idx) => {
                        return (<Badge key={idx} text={d.shortName} color={d.color} />);
                    })
                }
            </div>
        </div>
    )
});

export default Departments;