import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { Props } from '../iEventField';
import TextArea from '@site/src/components/shared/TextArea';
import Edit from './Edit';

const Location = observer((props: Props) => {
    const { event } = props;
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <div
            style={{ gridColumn: 'location' }}
            className={clsx(styles.location, props.className, 'grid-Location')}
        >
            {event.location}
        </div>
    );
});

export default Location;
