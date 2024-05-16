import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import {default as ShowAffectedAudience} from '../shared/AudiencePicker/Audience';
import Badge from '../shared/Badge';
import { mdiArrowLeftBoldCircleOutline, mdiArrowRightBoldCircleOutline, mdiArrowRightBottom, mdiCalendarImport, mdiEqual, mdiRecordCircleOutline, mdiText } from '@mdi/js';
import { Icon, SIZE } from '../shared/icons';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import Lesson from '../Lesson';
import Translate, { translate } from '@docusaurus/Translate';
import Description from './EventFields/Description';
import DescriptionLong from './EventFields/DescriptionLong';
import KW from './EventFields/Kw';
import Day from './EventFields/Day';
import { EndDateTime, StartDateTime } from './EventFields/DateTime';
import Location from './EventFields/Location';
import {default as AudiencePicker} from './EventFields/Audience';
import State from './EventFields/State';
import Departments from './EventFields/Departments';
import Klasses from './EventFields/Klasses';
import { EventAudienceOverviewTranslation, EventAudienceTranslationLong, EventState, EventStateActions, EventStateButton, EventStateColor } from '@site/src/api/event';
import TeachingAffected from './EventFields/TeachingAffected';
import Version from './EventFields/Version';
import CreatedAt from './EventFields/CreatedAt';
import UpdatedAt from './EventFields/UpdatedAt';
import HistoryPopup from './VersionHistory/HistoryPopup';
import DefaultActions from './EventActions';
import Popup from 'reactjs-popup';

interface Props {
    event: EventModel;
    inModal?: boolean;
    showVersionHeader?: boolean;
    hideLoadVersionsButton?: boolean;
    hideShowVersionsButton?: boolean;
}

const EventProps = observer((props: Props) => {
    const { event } = props;
    const [showAllAffectedLessons, setShowAllAffectedLessons] = React.useState(false);
    const userStore = useStore('userStore');
    const eventStore = useStore('eventStore');
    const socketStore = useStore('socketStore');
    const semesterStore = useStore('semesterStore');
    React.useEffect(() => {
        event?.loadVersions();
    }, [event]);
    const semester = event?.affectedSemesters[0] || semesterStore.currentSemester;

    const commonClasses = clsx(event?.isDeleted && styles.deleted) || '';
    const commonProps = { event, styles, className: commonClasses };
    const commonEditProps = { ...commonProps, isEditable: true };
    const showVersions = !props.hideLoadVersionsButton && (event.publishedVersionIds.length > 0 || event.hasParent);

    if (!event) {
        return null;
    }

    return (
        <DefinitionList className={clsx(styles.eventProps)}>
            {props.showVersionHeader && event.hasParent && (
                <>
                    {
                        [EventState.Draft, EventState.Review].includes(event.state) ? (
                            <>
                                <dt><Icon path={mdiArrowRightBoldCircleOutline} color='primary' /></dt>
                                <dd><Badge color='green' text="Neue Version" /></dd>
                                <dt className='line'></dt>
                            </>
                        ) : (
                            <>
                                <dt><Icon path={mdiArrowLeftBoldCircleOutline} color='grey' /></dt>
                                <dd><Badge color='grey' text="Alte Version" /></dd>
                                <dt className='line'></dt>
                            </>
                        )
                    }
                </>
            )}
            {props.showVersionHeader && !event.hasParent && event.hasChildren && (
                <>
                    <dt><Icon path={mdiRecordCircleOutline} color="green" /></dt>
                    <dd><Badge text={translate({message: 'Aktuell', id: 'event.version.current.short'})} /></dd>
                    <dt className='line'></dt>
                </>
            )}
            <dt>
                <Translate
                    id="event.description"
                    description='for a single event: description'
                >
                    Titel
                </Translate>
            </dt>
            <dd><Description {...commonEditProps} /></dd>
            <dt>
                <Translate
                    id="event.descriptionLong"
                    description='for a single event: description long'
                >
                    Beschreibung
                </Translate>
            </dt>
            <dd><DescriptionLong {...commonEditProps} displayMultiLine/></dd>
            <dt>
                <Translate
                    id="event.versionNumber"
                    description='for a single event: version number'
                >
                    Version
                </Translate>
            </dt>
            <dd>
                <Version {...commonProps} hideVersion={props.hideShowVersionsButton} />
            </dd>            
            {
                showVersions && (
                    <dd>
                        <HistoryPopup event={event} />
                    </dd>
                )
            }
            <dt>
                <Translate
                    id="event.createdAt"
                    description='for a single event: date of event creation'
                >
                    Erstellt am
                </Translate>
            </dt>
            <dd>
                <CreatedAt showTime {...commonProps} />
            </dd>
            {
                event.updatedAt.getTime() !== event.createdAt.getTime() && (
                    <>
                        <dt>
                            <Translate
                                id="event.updatedAt"
                                description='for a single event: date of update'
                            >
                                Aktualisiert am
                            </Translate>
                        </dt>
                        <dd>
                            <UpdatedAt showTime {...commonProps} />
                        </dd>
                    </>
                )
            }
            {
                event.firstAuthor && (
                    <>
                        <dt>
                            <Translate
                                id="event.firstAuthor"
                                description='for a single event: author of the first version'
                            >
                                Erstautor:in
                            </Translate>
                        </dt>
                        <dd>
                            <div className={clsx(styles.author)}>
                                <Badge
                                    text={event.firstAuthor.displayName}
                                    title={
                                        event.jobId
                                            ? translate({id: 'event.firstAuthor.title', message: 'Dieser Termin wurde ursprünglich von {author} erstellt.'}, {author: event.firstAuthor.displayName})
                                            : translate({id: 'event.firstAuthor.importedTitle', message: 'Dieser Termin wurde von {author} importiert.'}, {author: event.firstAuthor.displayName})
                                    }
                                    icon={event.jobId && mdiCalendarImport}
                                    iconSide='left'
                                />
                            </div>
                        </dd>
                    </>
                )
            }
            {
                event.author && event.firstAuthor?.displayName !== event.author.displayName && (
                    <>
                        <dt>
                            <Translate
                                id="event.modifier"
                                description='for a single event: author of the first version'
                            >
                                Geändert von
                            </Translate>
                        </dt>
                        <dd>
                            <div className={clsx(styles.author)}>
                                <Badge
                                    text={event.author.displayName}
                                    title={translate({id: 'event.modifier.title', message: 'Dieser Termin wurde von {author} aktualisiert.'}, {author: event.author.displayName})}
                                />
                            </div>
                        </dd>
                    </>
                )
            }
            <dt>
                <Translate
                    id="event.state"
                    description='for a single event: state'
                >
                    Status
                </Translate>
            </dt>
            <dd>
                <div className={clsx(styles.flex)}>
                    <State {...commonProps} showText />
                </div>
            </dd>
            <dt>
                <Translate
                    id="event.kw"
                    description='for a single event: kw'
                >
                    KW
                </Translate>
            </dt>
            <dd><KW {...commonProps} /></dd>
            <dt>
                <Translate
                    id="event.weekday"
                    description='for a single event: weekday'
                >
                    Wochentag
                </Translate>
            </dt>
            <dd><Day {...commonProps} showFullName showRange /></dd>
            <dt>
                <Translate
                    id="event.date"
                    description='for a single event: date range'
                >
                    Datum
                </Translate>
            </dt>
            <dd>
                <div className={clsx(styles.flex, commonClasses)}>
                    <StartDateTime {...commonEditProps} />
                </div>
            </dd>
            {!(event.isAllDay && event.isOnOneDay && !event.isEditing) && (
                <>
                    <dd>
                        <div className={clsx(styles.flex, commonClasses)}>
                            <Icon path={mdiArrowRightBottom} /><EndDateTime {...commonEditProps} />
                        </div>
                    </dd>
                    <dd>
                        <div className={clsx(styles.duration, styles.flex, commonClasses)}>
                            <Icon path={mdiEqual} />{event.fDuration}
                        </div>
                    </dd>
                </>
            )}
            <dt>
                <Translate
                    id="event.location"
                    description='for a single event: location'
                >
                    Ort
                </Translate>
            </dt>
            <dd><Location {...commonEditProps} /></dd>
            {event.isEditing ? (
                <>
                    <dt>
                        <Translate
                            id="event.audience"
                            description='for a single event: class and department picker'
                        >
                            Publikum
                        </Translate>
                    </dt>
                    <dd><AudiencePicker {...commonEditProps} /></dd>
                </>
            ) : (
                <>
                    {(event.classes.size + event.classGroups.size) > 0 && (
                        <>
                            <dt>
                                <Translate
                                    id="event.classes"
                                    description='for a single event: classes'
                                >
                                    Klassen
                                </Translate>
                            </dt>
                            <dd>
                                <Klasses {...commonProps} />
                            </dd>
                        </>
                    )}
                    {event.affectedDepartments.length > 0 && (
                        <>
                            <dt>
                                <Translate
                                    id="event.departments"
                                    description='for a single event: departments'
                                >
                                    Departemente
                                </Translate>
                            </dt>
                            <dd>
                                <Departments {...commonProps} flexWrap/>
                            </dd>
                        </>
                    )}
                    <dt>
                        <Translate
                            id="event.audience"
                            description='for a single event: class and department picker'
                        >
                            Publikum
                        </Translate>
                    </dt>
                    <dd>
                        <Popup
                            trigger={(
                                <span style={{display: 'inline-block'}}>
                                    <Badge text={EventAudienceOverviewTranslation[event.audience]} />
                                </span>
                            )}
                            on="hover"
                            position={['top center', 'top right', 'top left']}
                            nested
                            repositionOnResize
                        >
                            <ShowAffectedAudience event={event} />
                        </Popup>
                    </dd>
                </>
            )}
            <dt>
                <Translate
                    id="event.teachingAffected"
                    description='for a single event: teaching affected?'
                >
                    Unterricht Betroffen?
                </Translate>
            </dt>
            <dd>
                <span style={{display: 'inline-block'}}>
                    <TeachingAffected event={event} show='both' align='left' className={clsx(styles.teachingAffected)} />
                </span>
            </dd>
            {(event.meta && !event.isPublished && userStore.current.isAdmin ) && (
                <>
                    <dt>
                        <Translate
                            id="event.meta"
                            description='for a single event: audience long'
                        >
                            Metadaten
                        </Translate>
                    </dt>
                    <dd>
                        <pre>
                            <code>
                                {JSON.stringify(event.meta, null, 2)}
                            </code>
                        </pre>
                    </dd>
                </>
            )}
            <dt>
                <Translate
                    id="event.affectedLessons"
                    description='for a single event: affected lessons'
                >
                    Betroffene Lektionen
                </Translate>
            </dt>
            <dd>
                <Button
                    text={translate({
                        message: "Alle laden",
                        id: 'event.button.showAllLessons',
                        description: 'for a single event: button to show all affected lessons'
                    })}
                    icon={mdiText}
                    onClick={() => {
                        const showAll = !showAllAffectedLessons;
                        setShowAllAffectedLessons(showAll);
                        if (!showAll) {
                            return;
                        }
                        if (event.isDirty) {
                            socketStore.checkUnpersistedEvent(event.props, semester?.id);
                        } else {
                            socketStore.checkEvent(event.id, semester?.id);
                        }
                    }}
                />
            </dd>
            {(showAllAffectedLessons ? event.affectedLessonsGroupedByClass : event.usersAffectedLessonsGroupedByClass).map((kl, idx) => {
                if (kl.lessons.length === 0) {
                    return null;
                }
                return (<React.Fragment key={`kl-${idx}`}>
                    <dt className={commonClasses}>{kl.class}</dt>
                    <dd className={clsx(styles.lessons)}>
                        <div className={clsx(commonClasses)}>
                            {kl.lessons.map((l, idx) => (
                                <Lesson lesson={l} key={l.id} className={commonClasses} />
                            ))}
                        </div>
                    </dd>
                </React.Fragment>)
            })}
            {
                event.canChangeState && (
                    <>
                        <dt>
                            <Translate
                                id="event.requestState"
                                description='Requesting the next state, eg. Draft -> Review'
                            >
                                Status Ändern
                            </Translate>
                        </dt>
                        <dd>
                            {
                                event.possibleStates.map((state, idx) => {
                                    return (
                                        <Button
                                            key={state}
                                            text={EventStateActions[state]}
                                            icon={EventStateButton[state]}
                                            color={EventStateColor[state]}
                                            size={SIZE}
                                            iconSide='left'
                                            onClick={() => {
                                                event.requestState(state);
                                            }}
                                            apiState={eventStore.apiStateFor(`save-state-${state}-${event.id}`)}
                                        />
                                    )
                                })
                            }
                        </dd>
                    </>
                )
            }
            <dt>
                <Translate
                    id="event.actions"
                    description='Actions for a single event'
                >
                    Aktionen
                </Translate>
            </dt>
            <dd>
                <DefaultActions event={event} hideOpen={props.inModal} />
            </dd>
        </DefinitionList>
    )
});


export default EventProps;