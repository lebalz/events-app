import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import DatePicker from '../../shared/DatePicker';
import { default as EventModel } from '@site/src/models/Event';
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiCheckCircleOutline } from '@mdi/js';
import { ArrowLeft, ArrowRight, SIZE, SIZE_S } from '../../shared/icons';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Select from 'react-select';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../shared/Button';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '../../shared/Badge';
import { ApiState } from '@site/src/stores/iStore';
import DiffViewer from '../../Event/DiffViewer';

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

const BulkEditor = observer((props: Props) => {
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
        return (
            <div className={clsx('alert', 'alert--warning')}>
                <button
                    aria-label="Close"
                    className="clean-btn close"
                    type="button"
                    onClick={() => {
                        props.close();
                    }}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
                <Translate id="shiftDatesEditor.noEvent.alert">Keine Termine vorhanden.</Translate>
            </div>
        );
    }

    if (events.some((e) => !e.isDraft)) {
        return (
            <div className={clsx('alert', 'alert--warning')}>
                <button
                    aria-label="Close"
                    className="clean-btn close"
                    type="button"
                    onClick={() => {
                        props.close();
                    }}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
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
            </div>
            <div className={clsx(styles.editor, 'card__body')}>
                <div className={clsx(styles.actions)}>
                    <fieldset className={clsx(styles.dates)}>
                        <legend>
                            <Translate id="shiftedDatesEditor.dates">Tage</Translate>
                        </legend>
                        <DatePicker
                            date={viewed.start}
                            onChange={() => {}}
                            time="start"
                            disabled
                            id={viewed.id}
                        />
                        <Icon path={mdiArrowRightBoldCircle} size={SIZE} />
                        {shiftedEvent && (
                            <DatePicker
                                date={shiftedEvent.start}
                                onChange={(date) => {
                                    const to = new Date(
                                        `${date.toISOString().slice(0, 10)}${viewed.start.toISOString().slice(10)}`
                                    );
                                    const diff = to.getTime() - viewed.start.getTime();
                                    setShift(diff);
                                }}
                                time="start"
                                id={shiftedEvent.id}
                            />
                        )}
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
                <div className={clsx(styles.eventPicker)}>
                    <Button
                        icon={<ArrowLeft size={SIZE_S} />}
                        noOutline
                        className={clsx('badge', styles.button)}
                        onClick={() => setShiftedEventIdx(shiftedEventIdx - 1)}
                    />
                    <Badge
                        text={translate({
                            id: 'event.singular',
                            message: 'Termin'
                        })}
                        color="primary"
                    />
                    <Button
                        icon={<ArrowRight size={SIZE_S} />}
                        noOutline
                        className={clsx('badge', styles.button)}
                        onClick={() => setShiftedEventIdx(shiftedEventIdx + 1)}
                    />
                </div>
                {shiftedEvent && (
                    <DiffViewer
                        compare={[{ a: viewed, b: shiftedEvent }]}
                        labels={{
                            a: translate({ id: 'shiftedDatesEditor.current.label', message: 'Vorher' }),
                            b: translate({ id: 'shiftedDatesEditor.next.label', message: 'Nachher' })
                        }}
                        hideHeader
                    />
                )}
                {shift + hoursToMs(shiftedHours) !== 0 && (
                    <Button
                        text={translate({
                            id: 'shiftDatesEditor.apply',
                            message: 'Anwenden'
                        })}
                        onClick={() => {
                            eventStore.shiftEvents(events, shift + hoursToMs(shiftedHours)).then(() => {
                                props.close();
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

export default BulkEditor;
