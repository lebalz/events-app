import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';

const Description = observer((props: Props) => {
    if (props.isEditable && props.event.editing) {
        return (
            <div 
                style={{gridColumn: 'description'}} 
                className={clsx(styles.description, props.className)}
            >
                <textarea 
                    className={clsx(styles.textarea)}
                    value={props.event.description}
                    onChange={(e) => props.event.setDescription(e.target.value)}
                />
            </div>
        )
    }
    return (
        <div 
            style={{gridColumn: 'description'}} 
            className={clsx(styles.description, props.className)}
            onClick={() => props.event.setExpanded(true)}
        >
            {props.event.description}
        </div>
    )
});

export default Description;