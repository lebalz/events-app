import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import { mdiArrowRightCircle, mdiRecordCircleOutline, mdiShareAllOutline, mdiShareOutline } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { Icon, SIZE_S, SIZE_XS } from '../../shared/icons';
import Button from '../../shared/Button';
import Translate, { translate } from '@docusaurus/Translate';
import DefinitionList from '../../shared/DefinitionList';
import CreatedAt from './CreatedAt';
import UpdatedAt from './UpdatedAt';

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
            <Badge
                text={version}
                title={
                    <DefinitionList gridTemplateColumns='minmax(7em, 1fr) minmax(7em, 1fr)'>
                        <dt>
                            <Translate
                                id="event.createdAt"
                                description="for a single event: date of event creation"
                            >
                                Erstellt am
                            </Translate>
                        </dt>
                        <dd>
                            <CreatedAt showTime {...props} />
                        </dd>
                        {event.updatedAt.getTime() !== event.createdAt.getTime() && (
                            <>
                                <dt>
                                    <Translate
                                        id="event.updatedAt"
                                        description="for a single event: date of update"
                                    >
                                        Aktualisiert am
                                    </Translate>
                                </dt>
                                <dd>
                                    <UpdatedAt showTime {...props} />
                                </dd>
                            </>
                        )}
                    </DefinitionList>
                }
            />
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
