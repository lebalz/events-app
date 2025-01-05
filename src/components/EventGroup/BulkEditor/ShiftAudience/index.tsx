import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as EventModel } from '@site/src/models/Event';
import Translate, { translate } from '@docusaurus/Translate';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '../../../shared/Badge';
import { ApiState } from '@site/src/stores/iStore';
import AudienceShifter from './AudienceShifter';
import { mdiCheckCircleOutline } from '@mdi/js';
import Button from '@site/src/components/shared/Button';
import AudienceShift from './AudienceShift';
import Checkbox from '@site/src/components/shared/Checkbox';
import Preview from '../Preview';
import { reaction } from 'mobx';

interface Props {
    events: EventModel[];
    close: () => void;
}

const getClone = (event: EventModel, idPostFix: string = '') => {
    return new EventModel({ ...event._pristine, id: `${idPostFix}${event.id}` }, event.store);
};

const ShiftAudience = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    const [shifter, setShifter] = React.useState(
        new AudienceShifter(
            props.events.flatMap((e) => [...e.classes]),
            props.events.flatMap((e) => [...e.classGroups]),
            true,
            0
        )
    );
    const [shiftedYears, setShiftedYears] = React.useState(0);
    const [apiState, setApiState] = React.useState(ApiState.IDLE);
    const [shiftedEvent, setShiftedEvent] = React.useState<EventModel>(null);
    React.useEffect(() => {
        const nShifter = new AudienceShifter(
            props.events.flatMap((e) => [...e.classes]),
            props.events.flatMap((e) => [...e.classGroups]),
            shifter.shiftAudienceInText,
            shifter.shiftedEventIdx
        );
        setShifter(nShifter);
        nShifter.shiftAudience(shiftedYears);
        const disposer = reaction(
            () => `${nShifter.audience.toJSON()}${nShifter.shiftAudienceInText}${nShifter.shiftedEventIdx}`,
            () => {
                const event = props.events[nShifter.shiftedEventIdx % props.events.length];
                if (event) {
                    const clone = getClone(event, '---');
                    const change = eventStore.shiftAudiencePatch([clone], nShifter);
                    clone.update(change[0]);
                    setShiftedEvent(clone);
                }
            }
        );
        return () => {
            disposer();
        };
    }, [props.events]);

    return (
        <div className={clsx(styles.shiftEditor, 'card')}>
            <div className={clsx('card__header')}>
                <h3 className={clsx(styles.header)}>
                    <Translate id="shiftAudienceEditor.title">
                        Neuzuordnung von Jahrgängen und Klassen
                    </Translate>
                    <Badge text={`${props.events.length}`} color={EventStateColor.DRAFT} />
                </h3>
                <div className={clsx(styles.description, 'alert', 'alert--info')} role="alert">
                    <Badge icon={EventStateButton.DRAFT} size={0.8} color={EventStateColor.DRAFT} />
                    <Translate id="shiftAudienceEditor.description">
                        Nur Entwürfe können mit diesem Editor bearbeitet werden.
                    </Translate>
                </div>
            </div>
            <div className={clsx(styles.editor, 'card__body')}>
                <div className={clsx(styles.actions)}>
                    <fieldset className={clsx(styles.audience)}>
                        <legend>
                            <Translate id="shiftAudienceEditor.audience">Klassen</Translate>
                        </legend>
                        <input
                            id="shiftHours"
                            type="number"
                            value={shiftedYears}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                setShiftedYears(value);
                                shifter.shiftAudience(value);
                            }}
                        />
                        {Array.from(shifter.audience.keys()).map((klass) => (
                            <AudienceShift key={klass} audienceShifter={shifter} name={klass} />
                        ))}

                        <Checkbox
                            checked={shifter.shiftAudienceInText}
                            onChange={() => {
                                shifter.setShiftAudienceInText(!shifter.shiftAudienceInText);
                            }}
                            label={translate({
                                id: 'shiftAudienceEditor.shiftInText',
                                message: 'Klassenbezeichnungen im Titel und Beschreibung auch ändern'
                            })}
                        />
                    </fieldset>
                </div>
            </div>
            <Preview
                events={props.events}
                onChange={(idx) => shifter.setShiftedEventIdx(idx)}
                changedEvent={shiftedEvent}
            />
            {shifter.hasShifts && (
                <Button
                    text={translate({
                        id: 'shiftDatesEditor.apply',
                        message: 'Anwenden'
                    })}
                    onClick={() => {
                        eventStore.shiftEventAudience(props.events, shifter).then(() => {
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
    );
});

export default ShiftAudience;
