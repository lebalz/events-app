import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiArrowRightBottom, mdiDotsHorizontalCircleOutline, mdiDotsVerticalCircleOutline, mdiEqual, mdiText } from '@mdi/js';
import { EditIcon, Icon, SIZE_S } from '../shared/icons';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import Lesson from '../Lesson';
import Translate, { translate } from '@docusaurus/Translate';
import Description from './EventFields/Description';
import DescriptionLong from './EventFields/DescriptionLong';
import KW from './EventFields/Kw';
import Day from './EventFields/Day';
import DateTime from './EventFields/DateTime';
import Location from './EventFields/Location';
import Audience from './EventFields/Audience';
import State from './EventFields/State';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Edit from '../shared/Button/Edit';
import Actions from './EventFields/Actions';
import EventActions from './EventActions';
interface Props {
    event: EventModel;
    inModal?: boolean;
}

const Event = observer((props: Props) => {
    const { event } = props;
    const { i18n } = useDocusaurusContext();
    const socketStore = useStore('socketStore');
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const commonClasses = clsx(event.isDeleted && styles.deleted);
    const commonProps = { event, styles, className: commonClasses };
    const commonEditProps = { ...commonProps, isEditable: true };
    const [showOptions, setShowOptions] = React.useState(false);


    return (
        <div className={clsx(styles.eventCard, 'card')}>
            <div className={clsx(styles.header, 'card__header')}>
                <h3>{event.description}</h3>
            </div>
            <div className={clsx('card__body')}>
                <DefinitionList>
                    <dt><Translate id="event.description" description='for a single event: description'>Titel</Translate></dt>
                    <dd><Description {...commonEditProps} /></dd>
                    <dt><Translate id="event.descriptionLong" description='for a single event: description long'>Beschreibung</Translate></dt>
                    <dd><DescriptionLong {...commonEditProps} /></dd>
                    <dt><Translate id="event.state" description='for a single event: state'>Status</Translate></dt>
                    <dd className={clsx(styles.flex, commonClasses)}>
                        <State {...commonProps} />
                    </dd>
                    <dt><Translate id="event.kw" description='for a single event: kw'>KW</Translate></dt>
                    <dd><KW {...commonProps} /></dd>
                    <dt><Translate id="event.weekday" description='for a single event: weekday'>Wochentag</Translate></dt>
                    <dd><Day {...commonProps} showFullName showRange /></dd>
                    <dt><Translate id="event.date" description='for a single event: date range'>Datum</Translate></dt>
                    <dd className={clsx(styles.flex, commonClasses)}><DateTime {...commonEditProps} time='start' /></dd>
                    <dd className={clsx(styles.flex, commonClasses)}><Icon path={mdiArrowRightBottom} /><DateTime {...commonEditProps} time='end' /></dd>
                    <dd className={clsx(styles.duration, styles.flex, commonClasses)}><Icon path={mdiEqual} />{event.fDuration}</dd>
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
                                        <div className={clsx(styles.clases)}>
                                            {[...event.classes].map((cl, idx) => <Badge key={`cl-${idx}`} text={cl} />)}
                                        </div>
                                    </dd>
                                </>
                            )}
                            {event.affectedDepartments.length > 0 && (
                                <>
                                    <dt><Translate id="event.departments" description='for a single event: departments'>Departemente</Translate></dt>
                                    <dd>{event.affectedDepartments.map((dp, idx) => <Badge key={`gr-${idx}`} text={dp.name} color={dp.color} />)}</dd>
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
                                    <dt >{kl.class}</dt>
                                    <dd className={clsx(styles.lessons)}>
                                        {kl.lessons.map((l, idx) => (
                                            <Lesson lesson={l} key={l.id} />
                                        ))}
                                    </dd>
                                </React.Fragment>)
                            })}
                        </>
                    )}
                    {
                        !props.inModal && eventStore.canEdit(event) && (
                            <>
                                <dt>
                                    <Button
                                        icon={mdiDotsHorizontalCircleOutline}
                                        onClick={() => setShowOptions(!showOptions)}
                                        className={clsx(styles.optionsBtn, (showOptions || event.isEditing) && styles.showOptions)}
                                    />
                                </dt>
                                <dd>
                                    {(showOptions || event.isEditing) && (
                                        <div className={clsx(styles.options)}>
                                            <EventActions event={event} buttonOrder={['discard', 'save']} />
                                        </div>
                                    )}
                                </dd>
                            </>
                        )
                    }
                </DefinitionList>
            </div>
            <div className={clsx('card__footer', styles.footer)}>
                <Button
                    text={translate({ message: "Alle betroffenen Lektionen anzeigen", id: 'event.button.showAllLessons', description: 'for a single event: button to show all affected lessons' })}
                    icon={mdiText}
                    onClick={() => {
                        socketStore.checkUnpersistedEvent(event.props);
                    }}
                />
            </div>
        </div>
    )
});

export default Event;