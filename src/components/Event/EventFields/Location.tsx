import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const Location = observer((props: Props) => {
    const {event} = props;
    if (props.isEditable && event.isEditing) {
        return (
            <div 
                style={{gridColumn: 'location'}} 
                className={clsx(styles.location, props.className, 'grid-Location')}
            >
                <TextArea
                    text={event.location}
                    onChange={(loc) => event.update({location: loc})}
                />
            </div>
        )
    }
    return (
        <div 
            style={{gridColumn: 'location'}} 
            className={clsx(styles.location, props.className, 'grid-Location')}
        >
            {event.location}
        </div>
    )
});

export default Location;