import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import { mdiRecordCircleOutline } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { Icon } from '../../shared/icons';

interface Props extends ReadonlyProps {
}

const Version = observer((props: Props) => {
    const { event } = props;
    const version = `V${event.versionNumber}${(event.isDirty && !event.isDraft) ? '.*' : ''}`
    const isCurrent = !event.hasParent && !event.isDraft && !event.isDirty;
    return (
        <div 
            style={{gridColumn: 'version'}} 
            className={clsx('version', styles.version, props.className)}
        >
            <Badge text={version} />
            {isCurrent && <Icon path={mdiRecordCircleOutline} color="green" />}
            {isCurrent && <Badge
                text={event.updatedAt.toISOString().slice(0, 16).replace('T', ' ')}
                color='blue'
            />}
        </div>
    )
});

export default Version;