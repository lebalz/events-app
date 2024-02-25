import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import EventGroup from '@site/src/models/EventGroup';
import Event from './Event';
import DatePicker from '../../shared/DatePicker';
import {default as EventModel} from '@site/src/models/Event';
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiCheckCircleOutline } from '@mdi/js';
import { DiscardIcon, SIZE, SIZE_S, SaveIcon } from '../../shared/icons';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Select from 'react-select';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../shared/Button';


interface Props {
    group: EventGroup;
    close: () => void;
}

const getClone = (event: EventModel, idPostFix: string = '') => {
    return new EventModel({...event._pristine, id: `${idPostFix}${event.id}`}, event.store);
}

const ShiftDatesEditor = observer((props: Props) => {
    const [shift, setShift] = React.useState(0);
    const [event, setEvent] = React.useState<EventModel>(null);
    const [shiftedEvent, setShiftedEvent] = React.useState<EventModel>(null);
    const { group } = props;

    React.useEffect(() => {
        if (event) {
            const clone = getClone(event, '---');
            const toStart = new Date(event.start.getTime() + shift);
            const toEnd = new Date(event.end.getTime() + shift);
            clone.update({start: toGlobalDate(toStart).toISOString(), end: toGlobalDate(toEnd).toISOString()});
            setShiftedEvent(clone);
        }
    }, [event, group.events, shift]);

    React.useEffect(() => {
        if (group.events.length > 0) {
            const firstDraft = group.events.find(e => e.isDraft);
            if (firstDraft) {
                setEvent(getClone(firstDraft));
            }
        }
    }, [group.events]);

    return (
        <div className={clsx(styles.container)}>
            {event && shiftedEvent && (
                <>
                    <Event event={event} title="Aktuell" />
                    <div className={clsx(styles.actions)}>
                        <h4>
                            <Translate id="shiftDatesContainer.eventSelection">Vorschau-Event</Translate>
                        </h4>
                        <Select 
                            menuPortalTarget={document.body}
                            styles={{ 
                                menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' })
                            }}
                            value={{value: event.id, label: event.description}}
                            options={
                                group.events.filter(e => e.isDraft).map(e => ({value: e.id, label: e.description}))
                            }
                            onChange={(opt) => {
                                if (opt?.value) {
                                    const newEvent = group.events.find(e => e.id === opt.value);
                                    setEvent(getClone(newEvent));
                                }
                            }}
                            isMulti={false}
                            isSearchable={true}
                            isClearable={false}
                        />
                        <h4>
                            <Translate id="shiftDatesContainer.shift">Verschiebung</Translate>
                        </h4>
                        <div className={clsx(styles.dates)}>
                            <DatePicker
                                date={event.start}
                                onChange={() => {}}
                                time='start'
                                disabled
                                id={event.id}
                            />
                            <Icon path={mdiArrowRightBoldCircle} size={SIZE} />
                            <DatePicker
                                date={shiftedEvent.start}
                                onChange={(date) => {
                                    const to = new Date(`${date.toISOString().slice(0, 10)}${event.start.toISOString().slice(10)}`);
                                    const diff = to.getTime() - event.start.getTime();
                                    setShift(diff);
                                }}
                                time='start'
                                id={shiftedEvent.id}
                            />
                        </div>
                        {shift !== 0 && (
                            <Button
                                text={translate({id: "shiftDatesContainer.apply", message: "Anwenden (Vorschau)"})}
                                onClick={() => {
                                    group.shiftEvents(shift)
                                    setShift(0);
                                    props.close();
                                }}
                                color='green'
                                icon={mdiCheckCircleOutline}
                                iconSide='left'
                            />
                        )}
                    </div>
                    <Event event={shiftedEvent} title="Neu (Vorschau)"/>
                </>
            )}
        </div>
    )
});

export default ShiftDatesEditor;