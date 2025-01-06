import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import DatePicker from '../../../shared/DatePicker';
import { default as EventModel } from '@site/src/models/Event';
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiCheckCircleOutline } from '@mdi/js';
import { SIZE } from '../../../shared/icons';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../../shared/Button';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '../../../shared/Badge';
import { ApiState } from '@site/src/stores/iStore';
import Preview from '../Preview';
import DraftAlert from '../helpers/DraftAlert';
import EditableDrafts from '../helpers/EditeableDrafts';
import NoDraftEventsAlert from '../helpers/NoDraftEventsAlert';

interface Props {
    events: EventModel[];
    onClose: () => void;
}

const getClone = (event: EventModel, idPostFix: string = '') => {
    return new EventModel({ ...event._pristine, id: `${idPostFix}${event.id}` }, event.store);
};

const hoursToMs = (hours: number) => {
    return hours * 60 * 60 * 1000;
};

const ShiftDates = observer((props: Props) => {
    const { events } = props;
    const [shift, setShift] = React.useState(0);
    const [shiftedHours, setShiftedHours] = React.useState(0);
    const [shiftedEventIdx, setShiftedEventIdx] = React.useState(0);
    const [shiftedEvent, setShiftedEvent] = React.useState<EventModel>(null);
    const [apiState, setApiState] = React.useState(ApiState.IDLE);
    const eventStore = useStore('eventStore');

    const viewed = events[shiftedEventIdx % events.length];

    React.useEffect(() => {
        const event = events[shiftedEventIdx % events.length];
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
    }, [events, shiftedEventIdx, shift, shiftedHours]);

    if (!viewed) {
        return <NoDraftEventsAlert onClose={props.onClose} />;
    }

    if (events.some((e) => !e.isDraft)) {
        return <DraftAlert onClose={props.onClose} />;
    }

    return (
        <div className={clsx(styles.shiftEditor, 'card')}>
            <div className={clsx('card__header')}>
                <h3 className={clsx(styles.header)}>
                    <Translate id="shiftDatesEditor.title">Verschiebung von Terminen</Translate>
                </h3>
                <EditableDrafts count={events.length} />
            </div>
            <div className={clsx(styles.editor, 'card__body')}>
                <div className={clsx(styles.actions)}>
                    <fieldset className={clsx(styles.dates)}>
                        <legend>
                            <Translate id="shiftedDatesEditor.dates">Tage</Translate>
                        </legend>
                        <div className={clsx(styles.inputs)}>
                            <div className={clsx(styles.datePicker)}>
                                <span className={clsx(styles.day)}>{viewed.dayStart}.</span>
                                <DatePicker
                                    date={viewed.start}
                                    onChange={() => {}}
                                    time="start"
                                    disabled
                                    id={viewed.id}
                                />
                            </div>
                            <Icon path={mdiArrowRightBoldCircle} size={SIZE} />
                            {shiftedEvent && (
                                <div className={clsx(styles.datePicker)}>
                                    <span className={clsx(styles.day)}>{shiftedEvent.dayStart}.</span>
                                    <DatePicker
                                        date={shiftedEvent.start}
                                        onChange={(date) => {
                                            /**
                                             * In JS, a full day is e.g. from 1.1.2025 at 00:00 to 2.1.2025 at 00:00
                                             * Because of this, full-day events must be shifted by 1ms to the past to get
                                             * the correct day.
                                             */
                                            const changedDate = viewed.isAllDay
                                                ? new Date(date.getTime() - 1)
                                                : date;
                                            const to = new Date(
                                                `${changedDate.toISOString().slice(0, 10)}${viewed.start.toISOString().slice(10)}`
                                            );
                                            const diff = to.getTime() - viewed.start.getTime();
                                            setShift(diff);
                                        }}
                                        time="start"
                                        id={shiftedEvent.id}
                                    />
                                </div>
                            )}
                        </div>
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
                </div>
                <Preview
                    events={events}
                    onChange={(idx) => setShiftedEventIdx(idx)}
                    changedEvent={shiftedEvent}
                />
                {shift + hoursToMs(shiftedHours) !== 0 && (
                    <Button
                        text={translate({
                            id: 'shiftDatesEditor.apply',
                            message: 'Anwenden'
                        })}
                        onClick={() => {
                            eventStore.shiftEventDates(events, shift + hoursToMs(shiftedHours)).then(() => {
                                props.onClose();
                            });
                            setApiState(ApiState.LOADING);
                        }}
                        apiState={apiState}
                        color="green"
                        icon={mdiCheckCircleOutline}
                        iconSide="left"
                        className={clsx(styles.applyButton)}
                    />
                )}
            </div>
        </div>
    );
});

export default ShiftDates;
