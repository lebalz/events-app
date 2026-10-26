import clsx from 'clsx';
import React from 'react';

import { mdiRecordCircleOutline } from '@mdi/js';
import { default as EventModel } from '@site/src/models/Event';
import { formatDateTime } from '@site/src/models/helpers/time';
import { observer } from 'mobx-react-lite';
import Badge from '../../shared/Badge';
import { Icon } from '../../shared/icons';
import EventProps from '../EventProps';
import styles from './styles.module.scss';

interface Props {
    event: EventModel;
}

const VersionHistory = observer((props: Props) => {
    const { event } = props;
    return (
        <div className={clsx(styles.versions)}>
            {event.versions.toReversed().map((version, idx) => {
                const isLast = idx + 1 === event.versions.length;
                return (
                    <React.Fragment key={idx}>
                        <div
                            className={clsx(
                                styles.badge,
                                styles.versionItem,
                                idx % 2 === 0 ? styles.right : styles.left
                            )}
                        >
                            <Badge text={formatDateTime(version.updatedAt)} color="primary" />
                        </div>
                        <div className={clsx(styles.versionItem, styles.dot, isLast && styles.last)}>
                            <Icon path={mdiRecordCircleOutline} color="primary" />
                            <div className={clsx(styles.line)} />
                        </div>
                        <div
                            className={clsx(
                                styles.versionItem,
                                styles.versionCard,
                                'card',
                                idx % 2 === 0 ? styles.left : styles.right
                            )}
                        >
                            <div className={clsx('card__body')}>
                                <EventProps event={version} hideLoadVersionsButton />
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
});

export default VersionHistory;
