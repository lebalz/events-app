import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import {default as EventModel} from '@site/src/models/Event';
import DefinitionList from '../shared/DefinitionList';
import Badge from '../shared/Badge';
import { mdiArrowRightBottom, mdiText } from '@mdi/js';
import { Icon } from '../shared/icons';
import Button from '../shared/Button';
import { useStore } from '@site/src/stores/hooks';
import Lesson from '../Lesson';
import Translate, { translate } from '@docusaurus/Translate';
interface Props {
    event: EventModel;
}

const Event = observer((props: Props) => {
    const {event} = props;
    const socketStore = useStore('socketStore');
    return (
        <div className={clsx(styles.event, 'card')}>
            <div className={clsx('card__header')}>
                <h3>{event.description}</h3>
            </div>
            <div className={clsx('card__body')}>
                <DefinitionList>
                    <dt><Translate id="event.title" description='for a single event: title'>Titel</Translate></dt>
                    <dd>{event.description}</dd>
                    {event.descriptionLong && (
                        <>
                            <dt>Beschreibung</dt>
                            <dd>{event.descriptionLong}</dd>
                        </>
                    )}
                    <dt><Translate id="event.kw" description='for a single event: kw'>KW</Translate></dt>
                    <dd>{event.kw}</dd>
                    <dt><Translate id="event.weekday" description='for a single event: weekday'>Wochentag</Translate></dt>
                    <dd>{event.day}</dd>
                    <dt><Translate id="event.startDate" description='for a single event: start date'>Datum</Translate></dt>
                    <dd>{event.fStartDate} {event.fStartTime}</dd>
                    <dd><Icon path={mdiArrowRightBottom} />{event.fEndDate} {event.fEndTime}</dd>
                    <dt><Translate id="event.location" description='for a single event: location'>Ort</Translate></dt>
                    <dd>{event.location}</dd>
                    {event.classes.size > 0 && (
                        <>
                            <dt><Translate id="event.classes" description='for a single event: classes'>Klassen</Translate></dt>
                            <dd>{[...event.classes].map((cl, idx) => <Badge key={`cl-${idx}`} text={cl} />)}</dd>
                        </>
                    )}
                    {event.departments.length > 0 && (
                        <>
                            <dt><Translate id="event.departments" description='for a single event: departments'>Departemente</Translate></dt>
                            <dd>{event.departments.map((dp, idx) => <Badge key={`gr-${idx}`} text={dp.name} />)}</dd>
                        </>
                    )}
                    {event.affectedLessonsByClass.length > 0 && (
                        <>
                            <dt><Translate id="event.affectedLessons" description='for a single event: affected lessons'>Betroffene Lektionen</Translate></dt>
                                {event.affectedLessonsByClass.map((kl, idx) => (
                                    <React.Fragment key={`kl-${idx}`}>
                                        <dt >{kl.class}</dt>
                                        <dd className={clsx(styles.lessons)}>
                                            {kl.lessons.map((l, idx) => (
                                                <Lesson lesson={l} key={l.id} />
                                            ))}
                                        </dd>
                                    </React.Fragment>
                                ))}
                        </>
                    )}
                </DefinitionList>
            </div>
            <div className={clsx('card__footer')}>
                <Button
                    text={translate({message: "Alle betroffenen Lektionen anzeigen" , id: 'event.button.showAllLessons', description: 'for a single event: button to show all affected lessons'})}
                    icon={mdiText}
                    onClick={() => {
                        socketStore.checkEvent(event.id);
                    }}
                />
            </div>
        </div>
    )
});

export default Event;