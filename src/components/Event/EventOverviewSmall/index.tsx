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
import { mdiCircle, mdiMinus, mdiMinusThick } from '@mdi/js';
import Icon from '@mdi/react';

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
                <div className={clsx(styles.date, styles.dateStart)}>
                    {event.fStartDate.replace(/^0/, '')}
                </div>
                {!event.isOnOneDay && (
                    <div className={clsx(styles.date, styles.dateEnd)}>
                        {event.fEndDate.replace(/^0/, '')}
                    </div>
                )}
                {!event.isAllDay && (
                    <>
                        <div
                            className={clsx(
                                styles.date,
                                styles.time,
                                styles.timeStart,
                                event.isOnOneDay && styles.singleDayEvent
                            )}
                        >
                            {event.fStartTime}
                        </div>
                        <div
                            className={clsx(
                                styles.date,
                                styles.time,
                                styles.timeEnd,
                                event.isOnOneDay && styles.singleDayEvent
                            )}
                        >
                            {event.isOnOneDay && (
                                <Icon
                                    className={clsx(styles.timeDash)}
                                    path={mdiMinusThick}
                                    color="var(--ifm-color-success-lightest)"
                                    size={0.5}
                                />
                            )}
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
                        <div>
                            <div className={clsx(styles.fieldset)}>
                                <Badge
                                    text={translate({
                                        id: 'event.description',
                                        description: 'for a single event: description',
                                        message: 'Titel'
                                    })}
                                    className={clsx(styles.label)}
                                />
                                <h3>{event.description}</h3>
                            </div>
                            <div className={clsx(styles.fieldset)}>
                                <Badge
                                    text={translate({
                                        id: 'event.descriptionLong',
                                        description: 'for a single event: description long',
                                        message: 'Beschreibung'
                                    })}
                                    className={clsx(styles.label)}
                                />
                                <p className={clsx(styles.descriptionLong)}>{event.descriptionLong || '-'}</p>
                            </div>
                        </div>
                    }
                >
                    <span className={clsx(styles.title)}>
                        {event.description}
                        <small className={clsx(styles.small)}>{event.descriptionLong}</small>
                    </span>
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
                        <Popup
                            trigger={
                                <span style={{ display: 'flex' }}>
                                    {event.departments.slice(0, 2).map((d, idx) => {
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
                                    {event.departments.length > 2 && (
                                        <span style={{ fontSize: '1rem', lineHeight: 1, marginLeft: '4px' }}>
                                            ...
                                        </span>
                                    )}
                                </span>
                            }
                            on="hover"
                            position={['top center', 'top right', 'top left']}
                            nested
                            repositionOnResize
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '60vw' }}>
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
                        </Popup>
                    </div>
                )}
                {event.classGroups.size > 0 && (
                    <div className={clsx(styles.classGroups, styles.audience)}>
                        <Popup
                            trigger={
                                <span style={{ display: 'flex' }}>
                                    {[...event.classGroups].slice(0, 3).map((c) => (
                                        <Badge
                                            key={c}
                                            text={
                                                /(26|25)[FGWcmps]/.test(c) ? `${c.substring(0, 2)}*` : `${c}*`
                                            }
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
                                    {event.classGroups.size > 2 && (
                                        <span style={{ fontSize: '1rem', lineHeight: 1, marginLeft: '4px' }}>
                                            ...
                                        </span>
                                    )}
                                </span>
                            }
                            on="hover"
                            position={['top center', 'top right', 'top left']}
                            nested
                            repositionOnResize
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '60vw' }}>
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
                        </Popup>
                    </div>
                )}
                {event.classes.size > 0 && (
                    <div className={clsx(styles.classes, styles.audience)}>
                        <Popup
                            trigger={
                                <span style={{ display: 'flex' }}>
                                    {[...event.classes].slice(0, 3).map((c) => (
                                        <Badge
                                            key={c}
                                            text={untisStore.findClassByName(c)?.displayName || c}
                                            color={
                                                untisStore.findClassByName(c)?.color ||
                                                'var(--ifm-color-danger)'
                                            }
                                            className={clsx(styles.badge)}
                                        />
                                    ))}
                                    {event.classes.size > 2 && (
                                        <span style={{ fontSize: '1rem', lineHeight: 1, marginLeft: '4px' }}>
                                            ...
                                        </span>
                                    )}
                                </span>
                            }
                            on="hover"
                            position={['top center', 'top right', 'top left']}
                            nested
                            repositionOnResize
                        >
                            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '60vw' }}>
                                {[...event.classes].map((c) => (
                                    <Badge
                                        key={c}
                                        text={untisStore.findClassByName(c)?.displayName || c}
                                        color={
                                            untisStore.findClassByName(c)?.color || 'var(--ifm-color-danger)'
                                        }
                                        className={clsx(styles.badge)}
                                    />
                                ))}
                            </div>
                        </Popup>
                    </div>
                )}
            </div>
        </div>
    );
});

export default EventOverviewSmall;
