import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const DescriptionLong = observer((props: Props) => {
    const { styles } = props;
    if (props.isEditable && props.event.editing) {
        return (
            <div 
                style={{gridColumn: 'descriptionLong'}} 
                className={clsx(styles.descriptionLong, props.className, 'grid-descriptionLong')}
            >
                <TextArea
                    text={props.event.descriptionLong}
                    onChange={(text) => props.event.update({descriptionLong: text})}
                />
            </div>
        )
    }
    return (
        <div 
            style={{gridColumn: 'descriptionLong'}} 
            className={clsx(styles.descriptionLong, props.className, 'grid-descriptionLong')}
            onClick={() => props.event.setExpanded(true)}
        >
            {props.event.descriptionLong}
        </div>
    )
});

export default DescriptionLong;