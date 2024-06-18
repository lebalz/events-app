import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';
import Departments from './Departments';
import AudiencePicker from '../../shared/AudiencePicker';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const DepartmentsOrAudiencePicker = observer((props: Props) => {
    const { event } = props;
    if (event.isEditing) {
        return <AudiencePicker event={event} />;
    }
    return <Departments {...props} />;
});

export default DepartmentsOrAudiencePicker;
