import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const Description = observer((props: Props) => {
    const {event} = props;
    const error = event.errorFor('description');
    if (event.isEditable && event.isEditing) {
        return (
            <div 
                style={{gridColumn: 'description'}} 
                className={clsx(styles.description, props.className, error && styles.error, 'grid-description')}
                aria-invalid={!!error}
            >
                <TextArea
                    text={event.description}
                    onChange={(text) => event.update({description: text})}
                />
                {error && (
                    <div className={styles.errorMessage}>
                        {error.message}
                    </div>
                )}
            </div>
        )
    }
    return (
        <div 
            style={{gridColumn: 'description'}} 
            className={clsx(styles.description, props.className, 'grid-description')}
        >
            {event.description}
        </div>
    )
});

export default Description;