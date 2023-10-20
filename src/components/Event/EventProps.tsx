import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiArrowLeftBoldCircleOutline, mdiArrowRightBoldCircleOutline, mdiArrowRightBottom, mdiContentDuplicate, mdiDotsHorizontalCircleOutline, mdiDotsVerticalCircleOutline, mdiEqual, mdiRecordCircleOutline, mdiShareCircle, mdiText } from '@mdi/js';
import { EditIcon, Icon, SIZE, SIZE_S, SIZE_XS } from '../shared/icons';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import Lesson from '../Lesson';
import Translate, { translate } from '@docusaurus/Translate';
import Description from './EventFields/Description';
import DescriptionLong from './EventFields/DescriptionLong';
import KW from './EventFields/Kw';
import Day from './EventFields/Day';
import DateTime, { EndDateTime, StartDateTime } from './EventFields/DateTime';
import Location from './EventFields/Location';
import Audience from './EventFields/Audience';
import State from './EventFields/State';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from "@docusaurus/router";
import EventActions from './EventActions';
import Departments from './EventFields/Departments';
import Klasses from './EventFields/Klasses';
import { EventState, EventStateActions, EventStateButton, EventStateColor, EventStateTranslation } from '@site/src/api/event';
interface Props {
    event: EventModel;
    inModal?: boolean;
    showVersionHeader?: boolean;
}

const EventProps = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const history = useHistory();
    const commonClasses = clsx(event.isDeleted && styles.deleted);
    const commonProps = { event, styles, className: commonClasses };
    const commonEditProps = { ...commonProps, isEditable: true };
    const [showOptions, setShowOptions] = React.useState(false);

    const options = new Set<string>();
    if (!props.inModal && !event.isEditing) {
        options.add('clone');
    }
    if (!props.inModal && event.isEditable) {
        options.add('actions');
    }
    return (
        <DefinitionList className={clsx(styles.eventProps)}>
            {props.showVersionHeader && event.hasParent && (
                <>
                    {
                        [EventState.Draft, EventState.Review].includes(event.state) ? (
                            <>
                                <dt><Icon path={mdiArrowRightBoldCircleOutline} color='blue' /></dt>
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
                    <dd><Badge text="Aktuell" /></dd>
                    <dt className='line'></dt>
                </>
            )}
            <dt><Translate id="event.description" description='for a single event: description'>Titel</Translate></dt>
            <dd><Description {...commonEditProps} /></dd>
            <dt><Translate id="event.descriptionLong" description='for a single event: description long'>Beschreibung</Translate></dt>
            <dd><DescriptionLong {...commonEditProps} /></dd>
            <dt><Translate id="event.versionNumber" description='for a single event: version number'>Version</Translate></dt>
            <dd><div style={{display: 'flex'}}>
                <Badge text={`V${event.versionNumber}`} />
                {!event.hasParent && <Icon path={mdiRecordCircleOutline} color="green" />}
                {!event.hasParent && <Badge 
                                            text={event.updatedAt.toISOString().slice(0, 16).replace('T', ' ')} 
                                            color='blue'
                                        />}
                </div>
            </dd>
            <dt><Translate id="event.state" description='for a single event: state'>Status</Translate></dt>
            <dd>
                <div className={clsx(styles.flex)}>
                    <State {...commonProps} className='' showText/>
                </div>
            </dd>
            <dt><Translate id="event.kw" description='for a single event: kw'>KW</Translate></dt>
            <dd><KW {...commonProps} /></dd>
            <dt><Translate id="event.weekday" description='for a single event: weekday'>Wochentag</Translate></dt>
            <dd><Day {...commonProps} showFullName showRange /></dd>
            <dt><Translate id="event.date" description='for a single event: date range'>Datum</Translate></dt>
            <dd>
                <div className={clsx(styles.flex, commonClasses)}>
                    <StartDateTime {...commonEditProps} />
                </div>
            </dd>
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
            <dt><Translate id="event.location" description='for a single event: location'>Ort</Translate></dt>
            <dd><Location {...commonEditProps} /></dd>
            {event.isEditing ? (
                <>
                    <dt><Translate id="event.audience" description='for a single event: class and department picker'>Beteiligte</Translate></dt>
                    <dd><Audience {...commonEditProps} /></dd>
                </>
            ) : (
                <>
                    {event.classes.size > 0 && (
                        <>
                            <dt><Translate id="event.classes" description='for a single event: classes'>Klassen</Translate></dt>
                            <dd>
                                <Klasses {...commonProps} />
                            </dd>
                        </>
                    )}
                    {event.affectedDepartments.length > 0 && (
                        <>
                            <dt>
                                <Translate id="event.departments" description='for a single event: departments'>
                                    Departemente
                                </Translate>
                            </dt>
                            <dd>
                                <Departments {...commonProps} />
                            </dd>
                        </>
                    )}
                </>
            )}
            {event.affectedLessonsGroupedByClass.some(al => al.lessons.length > 0) && (
                <>
                    <dt><Translate id="event.affectedLessons" description='for a single event: affected lessons'>Betroffene Lektionen</Translate></dt>
                    {event.affectedLessonsGroupedByClass.map((kl, idx) => {
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
                </>
            )}
            {
                event.canChangeState && (
                    <>
                        <dt>
                            <Translate id="event.requestState" description='Requesting the next state, eg. Draft -> Review'>
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
                                            size={SIZE_XS}
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
            {
                options.size > 0 && (
                    <>
                        <dt>
                            <Button
                                icon={mdiDotsHorizontalCircleOutline}
                                onClick={() => setShowOptions(!showOptions)}
                                disabled={!viewStore.user}
                                className={clsx(styles.optionsBtn, (showOptions || (!props.inModal && event.isEditing)) && styles.showOptions)}
                            />
                        </dt>
                        <dd>
                            <div className={clsx(styles.options)}>
                                {options.has('actions') && (showOptions || event.isEditing ) && (
                                    <EventActions 
                                        event={event}
                                        size={SIZE*0.99}
                                        buttonOrder={['discard', 'save']}
                                        exclude={props.inModal ? [] : ['open']}
                                    />
                                )}
                                {options.has('clone') && showOptions && (
                                    <Button
                                        icon={mdiContentDuplicate}
                                        size={SIZE*0.99}
                                        title='Duplizieren'
                                        onClick={() => {
                                            eventStore.clone(event).then((newEvent) => {
                                                if (newEvent) {
                                                    const id = (newEvent as { id: string }).id;
                                                    history.push(`/user?user-tab=events`);
                                                    eventStore.find(id)?.setEditing(true);
                                                }
                                            });

                                        }}
                                    />
                                )}
                            </div>
                        </dd>
                    </>
                )
            }
        </DefinitionList>
    )
});


export default EventProps;