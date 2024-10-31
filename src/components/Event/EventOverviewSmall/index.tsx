import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import {
    EventAudienceOverviewTranslation,
    EventStateButton,
    EventStateColor,
    EventStateTranslation
} from '@site/src/api/event';
import Badge from '../../shared/Badge';
import Popup from 'reactjs-popup';
import Audience from '../../shared/AudiencePicker/Audience';
import { IfmColors } from '../../shared/Colors';
import Translate, { translate } from '@docusaurus/Translate';
import Tooltip from '../../shared/Tooltip';
import { TeachingAffectedColors, TitleMap as TeachingAffectedTitle } from '../EventFields/TeachingAffected';
import { mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import DefinitionList from '../../shared/DefinitionList';

interface Props {
    event: Event;
    className?: string;
}

const EventOverviewSmall = observer((props: Props) => {
    const untisStore = useStore('untisStore');
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const { event } = props;
    return (
        <div
            className={clsx(styles.event, props.className)}
            style={{ borderColor: IfmColors[EventStateColor[event.state]] }}
            onClick={() => {
                viewStore.setEventModalId(event.id);
            }}
        >
            <div className={clsx(styles.header)}>
                <div className={clsx(styles.date, styles.dateStart)}>{event.fStartDate}</div>
                {!event.isOnOneDay && (
                    <div className={clsx(styles.date, styles.dateEnd)}>{event.fEndDate}</div>
                )}
                {!event.isAllDay && (
                    <>
                        <div className={clsx(styles.date, styles.timeStart)}>{event.fStartTime}</div>
                        <div className={clsx(styles.date, styles.timeEnd)}>
                            {' - '}
                            {event.fEndTime}
                        </div>
                    </>
                )}
                {event.location.length > 0 && (
                    <div className={clsx(styles.location)}>
                        {event.location.length > 20 ? (
                            <Tooltip
                                title={
                                    <div>
                                        <h4 style={{ marginBottom: 0 }}>
                                            <Translate
                                                id="event.location"
                                                description="for a single event: location"
                                            >
                                                Ort
                                            </Translate>
                                        </h4>
                                        {event.location}
                                    </div>
                                }
                            >
                                <span>{`@ ${event.location.substring(0, 17)}...`}</span>
                            </Tooltip>
                        ) : (
                            <>
                                {'@ '}
                                {event.location}
                            </>
                        )}
                    </div>
                )}
                <div className={clsx(styles.author)}>
                    <Badge
                        text={event.author?.shortName}
                        title={event.author?.fullName}
                        className={clsx(styles.badge)}
                    />
                </div>
            </div>
            <div className={clsx(styles.body)}>
                <Tooltip
                    title={
                        <DefinitionList slim>
                            <dt>
                                <Translate
                                    id="event.description"
                                    description="for a single event: description"
                                >
                                    Titel
                                </Translate>
                            </dt>
                            <dd>{event.description}</dd>
                            <dt>
                                <Translate
                                    id="event.descriptionLong"
                                    description="for a single event: description long"
                                >
                                    Beschreibung
                                </Translate>
                            </dt>
                            <dd>{event.descriptionLong || '-'}</dd>
                        </DefinitionList>
                    }
                >
                    <span className={clsx(styles.title)}>{event.description}</span>
                </Tooltip>
            </div>
            <div className={clsx(styles.footer)}>
                {!event.isPublished && (
                    <div className={clsx(styles.state)}>
                        <Badge
                            icon={EventStateButton[event.state]}
                            color={EventStateColor[event.state]}
                            size={0.4}
                            title={EventStateTranslation[event.state]}
                            className={clsx(styles.badge)}
                        />
                    </div>
                )}
                <div className={clsx(styles.teachingAffected)}>
                    <Tooltip
                        title={
                            <div>
                                <div>{TeachingAffectedTitle[event.teachingAffected]}</div>
                            </div>
                        }
                    >
                        <Icon
                            path={mdiCircle}
                            color={TeachingAffectedColors[event.teachingAffected]}
                            size={0.6}
                            className={clsx(styles.teachingAffectedIcon)}
                        />
                    </Tooltip>
                </div>
                <div className={clsx(styles.spacer)} />
                <div className={clsx(styles.target, styles.audience)}>
                    <Popup
                        trigger={
                            <span style={{ display: 'inline-block' }}>
                                <Badge
                                    text={EventAudienceOverviewTranslation[event.audience]}
                                    className={clsx(styles.badge)}
                                />
                            </span>
                        }
                        on="hover"
                        position={['top center', 'top right', 'top left']}
                        nested
                        repositionOnResize
                    >
                        <Audience event={event} />
                    </Popup>
                </div>
                {event.departmentIds.size > 0 && (
                    <div className={clsx(styles.departments, styles.audience)}>
                        {event.departments.map((d, idx) => {
                            return (
                                <Badge
                                    key={idx}
                                    text={d.shortName}
                                    title={d.description}
                                    color={d.color}
                                    className={clsx(styles.badge)}
                                />
                            );
                        })}
                    </div>
                )}
                {event.classGroups.size > 0 && (
                    <div className={clsx(styles.classGroups, styles.audience)}>
                        {[...event.classGroups].map((c) => (
                            <Badge
                                key={c}
                                text={/(26|25)[FGWcmps]/.test(c) ? `${c.substring(0, 2)}*` : `${c}*`}
                                title={translate(
                                    {
                                        message: 'Alle Klassen der Stufe {classGroup}',
                                        description: 'EventOverviewSmall class group badge title',
                                        id: 'event.classGroupBadgeTitle'
                                    },
                                    { classGroup: c }
                                )}
                                color={
                                    departmentStore.findByClassGroupName(c)?.color ||
                                    'var(--ifm-color-secondary)'
                                }
                                className={clsx(styles.badge)}
                            />
                        ))}
                    </div>
                )}
                {event.classes.size > 0 && (
                    <div className={clsx(styles.classes, styles.audience)}>
                        {[...event.classes].map((c) => (
                            <Badge
                                key={c}
                                text={untisStore.findClassByName(c)?.displayName || c}
                                color={untisStore.findClassByName(c)?.color || 'var(--ifm-color-danger)'}
                                className={clsx(styles.badge)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default EventOverviewSmall;
