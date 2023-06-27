import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from './iEventField';
import Badge from '@site/src/components/shared/Badge';
import AudiencePicker from '@site/src/components/shared/AudiencePicker';
import { KlassName } from '@site/src/models/helpers/klassNames';
import SubjectSelector from './SubjectSelector';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
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
                {/* <SubjectSelector event={event} styles={styles}/> */}
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