import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import AudiencePicker from '@site/src/components/shared/AudiencePicker';
import Departments from './Departments';
import Klasses from './Klasses';

interface Props extends CommonProps {
    isEditGrid?: boolean; /** true when at least one element of the grid is edited */
}

const Audience = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return (
            <div
                style={{ gridColumnStart: 'departments', gridColumnEnd: 'classesEnd' }}
                className={clsx(styles.audience, 'grid-audience', props.className)}
            >
                <AudiencePicker event={event} />
            </div>
        )
    }
    return (
        <React.Fragment>
            <Departments {...props} />
            <Klasses {...props} />
        </React.Fragment>
    )
});

export default Audience;