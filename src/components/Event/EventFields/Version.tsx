import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import { mdiArrowRightCircle, mdiRecordCircleOutline, mdiShareAllOutline, mdiShareOutline } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { Icon, SIZE_XS } from '../../shared/icons';
import Button from '../../shared/Button';
import { translate } from '@docusaurus/Translate';

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
            {event.unpublishedChildren.length > 0 && (
                <Button 
                    text={translate({
                        id: 'event.show-unpublished-versions',
                        message: 'Aktualisierungen'
                    })}
                    size={SIZE_XS}
                    title={translate({
                        id: 'event.show-unpublished-versions-title',
                        message: 'Zeige {count} Aktualisierung{plural}',
                    }, {count: event.unpublishedChildren.length, plural: event.unpublishedChildren.length > 1 ? 'en' : ''})}
                    icon={event.unpublishedChildren.length === 1 ? mdiShareOutline : mdiShareAllOutline}
                    color='blue'
                    href={`/event?${event.unpublishedChildren.map(e => e.queryParam).join('&')}`}
                />
            )}
        </div>
    )
});

export default Version;