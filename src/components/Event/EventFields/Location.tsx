import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { Props } from './iEventField';
import TextArea from '@site/src/components/shared/TextArea';

const Location = observer((props: Props) => {
    const { styles, onClick } = props;
    if (props.isEditable && props.event.isEditing) {
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
            onClick={onClick}
        >
            {props.event.location}
        </div>
    )
});

export default Location;