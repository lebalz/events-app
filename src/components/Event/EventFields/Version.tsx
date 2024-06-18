import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import { mdiArrowRightCircle, mdiRecordCircleOutline, mdiShareAllOutline, mdiShareOutline } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { Icon, SIZE_S, SIZE_XS } from '../../shared/icons';
import Button from '../../shared/Button';
import { translate } from '@docusaurus/Translate';

interface Props extends ReadonlyProps {
    hideVersion?: boolean;
}

const UpdateTranslation = {
    singular: translate({
        id: 'event.showUnpublishedVersions.singular.text',
        message: 'Entwurf',
        description: 'singular'
    }),
    plural: translate({
        id: 'event.showUnpublishedVersions.text',
        message: 'Entwürfe',
        description: 'plural'
    })
};

const Version = observer((props: Props) => {
    const { event } = props;
    const version = `V${event.versionNumber}${event.isDirty && !event.isDraft ? '.*' : ''}`;
    const isCurrent = !event.hasParent && !event.isDraft && !event.isDirty;
    const nVersions = event.unpublishedVersions.length;
    return (
        <div style={{ gridColumn: 'version' }} className={clsx('version', styles.version, props.className)}>
            <Badge text={version} />
            {isCurrent && <Icon path={mdiRecordCircleOutline} color="green" />}
            {isCurrent && (
                <Badge text={event.updatedAt.toISOString().slice(0, 16).replace('T', ' ')} color="primary" />
            )}
            {!props.hideVersion && nVersions > (event.isPublished ? 0 : 1) && (
                <Button
                    text={`${nVersions} ${nVersions === 1 ? UpdateTranslation.singular : UpdateTranslation.plural}`}
                    size={SIZE_S}
                    title={translate(
                        {
                            id: 'event.showUnpublishedVersions.title',
                            message: 'Zeige {count} {updates}'
                        },
                        {
                            count: nVersions,
                            updates: nVersions > 1 ? UpdateTranslation.plural : UpdateTranslation.singular
                        }
                    )}
                    icon={nVersions === 1 ? mdiShareOutline : mdiShareAllOutline}
                    color="primary"
                    href={`/event?${event.unpublishedVersions.map((e) => e.queryParam).join('&')}`}
                />
            )}
        </div>
    );
});

export default Version;
