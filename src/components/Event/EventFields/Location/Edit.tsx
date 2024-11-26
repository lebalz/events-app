import React from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props } from '../iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const Edit = observer((props: Props) => {
    const { event } = props;
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div
            style={{ gridColumn: 'location' }}
            className={clsx(styles.location, props.className, 'grid-Location')}
        >
            <TextArea text={event.location} onChange={(loc) => event.update({ location: loc })} rows={2} />
        </div>
    );
});

export default Edit;
