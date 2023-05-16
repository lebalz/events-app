import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const Description = observer((props: Props) => {
    const { styles } = props;
    const error = props.event.errorFor('description');
    if (props.isEditable && props.event.editing) {
        return (
            <div 
                style={{gridColumn: 'description'}} 
                className={clsx(styles.description, props.className, error && styles.error, 'grid-description')}
                aria-invalid={!!error}
            >
                <TextArea
                    text={props.event.description}
                    onChange={(text) => props.event.update({description: text})}
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
            onClick={() => props.event.setExpanded(true)}
        >
            {props.event.description}
        </div>
    )
});

export default Description;