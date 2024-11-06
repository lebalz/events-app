import React from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props } from '../iEventField';
import Edit from './Edit';

const Description = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <div
            style={{ gridColumn: 'description' }}
            className={clsx(styles.description, props.className, 'grid-description')}
        >
            {event.description}
        </div>
    );
});

export default Description;
