import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import EventGroup from '@site/src/models/EventGroup';
// import Event from './Event';
import DatePicker from '../../shared/DatePicker';
import { default as EventModel } from '@site/src/models/Event';
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiCheckCircleOutline } from '@mdi/js';
import { DiscardIcon, SIZE, SIZE_S, SaveIcon } from '../../shared/icons';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Select from 'react-select';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../shared/Button';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '../../shared/Badge';
import { ApiState } from '@site/src/stores/iStore';
import EventOverviewSmall from '../../EventOverviewSmall';

interface Props {
    events: EventModel[];
    close: () => void;
}

const getClone = (event: EventModel, idPostFix: string = '') => {
    return new EventModel({ ...event._pristine, id: `${idPostFix}${event.id}` }, event.store);
};

const hoursToMs = (hours: number) => {
    return hours * 60 * 60 * 1000;
};

const ShiftDatesEditor = observer((props: Props) => {
    const { events } = props;
    const [shift, setShift] = React.useState(0);
    const [shiftedHours, setShiftedHours] = React.useState(0);
    const [event, setEvent] = React.useState<EventModel>(events[0] ? getClone(events[0]) : null);
    const [shiftedEvent, setShiftedEvent] = React.useState<EventModel>(null);
    const [apiState, setApiState] = React.useState(ApiState.IDLE);
    const eventStore = useStore('eventStore');

    React.useEffect(() => {
        if (event) {
            const clone = getClone(event, '---');
            const toStart = new Date(event.start.getTime() + shift + hoursToMs(shiftedHours));
            const toEnd = new Date(event.end.getTime() + shift + hoursToMs(shiftedHours));
            clone.update({
                start: toGlobalDate(toStart).toISOString(),
                end: toGlobalDate(toEnd).toISOString()
            });
            setShiftedEvent(clone);
        }
    }, [event, shift, shiftedHours]);

    React.useEffect(() => {
        if (events.length > 0) {
            setEvent(getClone(events[0]));
        }
    }, [events]);

    if (events.some((e) => !e.isDraft)) {
        return (
            <div className={clsx('alert', 'aler--warning')}>
                <Translate id="shiftDatesEditor.invalidEvents.alert">
                    Der Editor kann nur Entwürfe bearbeiten. Aktuell sind auch eingereichte, zurückgewiesene
                    oder veröffentlichte Termine vorhanden.
                </Translate>
            </div>
        );
    }

    return (
        <div className={clsx(styles.shiftEditor, 'card')}>
            <div className={clsx('card__header')}>
                <h3>
                    <Translate id="shiftDatesEditor.title">Verschiebung von Terminen</Translate>
                </h3>
                <div className={clsx(styles.description)}>
                    <Badge
                        icon={EventStateButton.DRAFT}
                        size={0.8}
                        color={EventStateColor.DRAFT}
                        className={clsx(styles.draftBadge)}
                    />
                    <Translate id="shiftDatesEditor.description">
                        Entwürfe können mit dem Verschiebe-Editor bearbeitet werden.
                    </Translate>
                </div>
                {event && (
                    <Select
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' })
                        }}
                        value={{ value: event.id, label: event.description }}
                        options={events.map((e) => ({ value: e.id, label: e.description }))}
                        onChange={(opt) => {
                            if (opt?.value) {
                                const newEvent = events.find((e) => e.id === opt.value);
                                setShiftedEvent(null);
                                setEvent(getClone(newEvent));
                            }
                        }}
                        isMulti={false}
                        isSearchable={true}
                        isClearable={false}
                    />
                )}
            </div>
            <div className={clsx(styles.editor, 'card__body')}>
                {event && shiftedEvent && (
                    <>
                        <EventOverviewSmall event={event} />
                        <div className={clsx(styles.actions)}>
                            <h4>
                                <Translate id="shiftDatesEditor.shift">Verschiebung</Translate>
                            </h4>
                            <fieldset className={clsx(styles.dates)}>
                                <legend>
                                    <Translate id="shiftedDatesEditor.dates">Tage</Translate>
                                </legend>
                                <DatePicker
                                    date={event.start}
                                    onChange={() => {}}
                                    time="start"
                                    disabled
                                    id={event.id}
                                />
                                <Icon path={mdiArrowRightBoldCircle} size={SIZE} />
                                <DatePicker
                                    date={shiftedEvent.start}
                                    onChange={(date) => {
                                        const to = new Date(
                                            `${date.toISOString().slice(0, 10)}${event.start.toISOString().slice(10)}`
                                        );
                                        const diff = to.getTime() - event.start.getTime();
                                        setShift(diff);
                                    }}
                                    time="start"
                                    id={shiftedEvent.id}
                                />
                            </fieldset>
                            <fieldset className={clsx(styles.hours)}>
                                <legend>
                                    <Translate id="shiftDatesEditor.hours">Stunden</Translate>
                                </legend>
                                <input
                                    id="shiftHours"
                                    type="number"
                                    value={shiftedHours}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value);
                                        setShiftedHours(value);
                                    }}
                                />
                            </fieldset>
                            {shift + hoursToMs(shiftedHours) !== 0 && (
                                <Button
                                    text={translate({
                                        id: 'shiftDatesEditor.apply',
                                        message: 'Anwenden'
                                    })}
                                    onClick={() => {
                                        eventStore
                                            .shiftEvents(events, shift + hoursToMs(shiftedHours))
                                            .then(() => {
                                                props.close();
                                            });
                                        setApiState(ApiState.LOADING);
                                    }}
                                    apiState={apiState}
                                    color="green"
                                    icon={mdiCheckCircleOutline}
                                    iconSide="left"
                                />
                            )}
                        </div>
                        <EventOverviewSmall event={shiftedEvent} compareWith={event} />
                    </>
                )}
            </div>
        </div>
    );
});

export default ShiftDatesEditor;
