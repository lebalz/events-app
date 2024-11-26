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
    const error = event.errorFor('description');
    return (
        <div
            style={{ gridColumn: 'description' }}
            className={clsx(styles.description, props.className, error && styles.error, 'grid-description')}
            aria-invalid={!!error}
        >
            <TextArea text={event.description} onChange={(text) => event.update({ description: text })} />
            {error && <div className={clsx(styles.errorMessage)}>{error.message}</div>}
        </div>
    );
});

export default Edit;
