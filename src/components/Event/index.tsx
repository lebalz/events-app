import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import { mdiHistory, mdiRecordCircleOutline } from '@mdi/js';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import { translate } from '@docusaurus/Translate';
import EventBody from './EventBody';
import { action } from 'mobx';
import EventProps from './EventProps';
import Badge from '../shared/Badge';
import { Icon } from '../shared/icons';
interface Props {
    event: EventModel;
    inModal?: boolean;
}

const Event = observer((props: Props) => {
    const { event } = props;
    const eventStore = useStore('eventStore');
    return (
        <div className={clsx(styles.eventCard, 'card')}>
            {!props.inModal && (
                <div className={clsx(styles.header, 'card__header')}>
                    <h3>{event.description}</h3>
                </div>
            )}
            <div className={clsx('card__body')}>
                <EventBody {...props} />
            </div>
            <div className={clsx('card__body')}>
                {event.versionsLoaded ? (
                    <div className={clsx(styles.versions)}>
                        {event.versions.toReversed().map((version, idx) => {
                            const isLast = (idx + 1) === event.versions.length;
                            return (
                                <React.Fragment key={idx}>
                                    <div className={clsx(styles.versionItem, (idx % 2) === 0 ? styles.right : styles.left)}>
                                        <Badge
                                            text={version.createdAt.toISOString().slice(0, 16).replace('T', ' ')}
                                            color='blue'
                                        />
                                    </div>
                                    <div className={clsx(styles.versionItem, styles.dot, isLast && styles.last)}>
                                        <Icon path={mdiRecordCircleOutline} color="blue" />
                                        <div className={clsx(styles.line)} />
                                    </div>
                                    <div className={clsx(styles.versionItem, styles.versionCard, 'card', (idx % 2) === 0 ? styles.left : styles.right)}>
                                        <div className={clsx('card__body')}>
                                            <EventProps event={version} />
                                        </div>
                                    </div>
                                </React.Fragment>
                            )
                        })}
                    </div>
                ) : (
                    <Button
                        text={translate({
                            message: "Versionen laden",
                            id: 'event.button.loadVersions',
                            description: 'for a single event: button to load version history'
                        })}
                        icon={mdiHistory}
                        onClick={action(() => {
                            event.loadVersions();
                        })}
                        apiState={eventStore.apiStateFor(`load-versions-${event.id}`)}
                    />
                )}
            </div>
        </div>
    )
});

export default Event;