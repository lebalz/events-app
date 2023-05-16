import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const Location = observer((props: Props) => {
    const { styles } = props;
    if (props.isEditable && props.event.editing) {
        return (
            <div 
                style={{gridColumn: 'location'}} 
                className={clsx(styles.location, props.className, 'grid-Location')}
            >
                <TextArea
                    text={props.event.location}
                    onChange={(loc) => props.event.update({location: loc})}
                />
            </div>
        )
    }
    return (
        <div 
            style={{gridColumn: 'location'}} 
            className={clsx(styles.location, props.className, 'grid-Location')}
            onClick={() => props.event.setExpanded(true)}
        >
            {props.event.location}
        </div>
    )
});

export default Location;