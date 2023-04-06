import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import useAutosizeTextArea from '@site/src/components/shared/hooks/useAutoSizeTextArea';
import TextArea from '@site/src/components/shared/TextArea';

const Description = observer((props: Props) => {
    const [textAreaRef, setTextAreaRef] = React.useState<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef, props.event.description, [props.event.editing, props.isEditable]);

    if (props.isEditable && props.event.editing) {
        return (
            <div 
                style={{gridColumn: 'description'}} 
                className={clsx(styles.description, props.className)}
            >
                <TextArea
                    text={props.event.description}
                    onChange={(text) => props.event.setDescription(text)}
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