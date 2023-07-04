import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const DescriptionLong = observer((props: Props) => {
    const {event} = props;
    if (event.isEditable && event.isEditing) {
        return (
            <div 
                style={{gridColumn: 'descriptionLong'}} 
                className={clsx(styles.descriptionLong, props.className, 'grid-descriptionLong')}
            >
                <TextArea
                    text={event.descriptionLong}
                    onChange={(text) => event.update({descriptionLong: text})}
                />
            </div>
        )
    }
    return (
        <div 
            style={{gridColumn: 'descriptionLong'}} 
            className={clsx(styles.descriptionLong, props.className, 'grid-descriptionLong')}
        >
            {event.descriptionLong}
        </div>
    )
});

export default DescriptionLong;