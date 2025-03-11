import React, { type ReactNode } from 'react';

import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Departments from './Departments';
import AudiencePicker from '../../shared/AudiencePicker';
import TeachingAffected from './TeachingAffected';
import clsx from 'clsx';
import styles from './styles.module.scss';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const DepartmentsOrAudiencePicker = observer((props: Props) => {
    const { event } = props;
    if (event.isEditing) {
        return (
            <div className={clsx(styles.departmentsOrAudience)}>
                <span className={clsx(styles.teachingAffected)}>
                    <TeachingAffected event={props.event} isEditable />
                </span>
                <AudiencePicker event={event} />
            </div>
        );
    }
    return <Departments {...props} />;
});

export default DepartmentsOrAudiencePicker;
