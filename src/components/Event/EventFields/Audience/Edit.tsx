import React from 'react';
import clsx from 'clsx';

import sharedStyles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props as CommonProps } from '../iEventField';
import AudiencePicker from '@site/src/components/shared/AudiencePicker';

interface Props extends CommonProps {
    isEditGrid?: boolean /** true when at least one element of the grid is edited */;
}

const Edit = observer((props: Props) => {
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div
            style={{ gridColumnStart: 'departments', gridColumnEnd: 'classesEnd' }}
            className={clsx(sharedStyles.audience, 'grid-audience', props.className)}
        >
            <AudiencePicker event={event} />
        </div>
    );
});

export default Edit;
