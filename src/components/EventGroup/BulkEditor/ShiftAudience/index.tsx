import clsx from 'clsx';
import React from 'react';

import Translate, { translate } from '@docusaurus/Translate';
import { mdiCheckCircleOutline } from '@mdi/js';
import Button from '@site/src/components/shared/Button';
import Checkbox from '@site/src/components/shared/Checkbox';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { ApiState } from '@site/src/stores/iStore';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import DraftAlert from '../helpers/DraftAlert';
import EditableDrafts from '../helpers/EditeableDrafts';
import NoDraftEventsAlert from '../helpers/NoDraftEventsAlert';
import Preview from '../Preview';
import AudienceShift from './AudienceShift';
import AudienceShifter from './AudienceShifter';
import styles from './styles.module.scss';

interface Props {
    events: EventModel[];
    onClose: () => void;
}

const getClone = (event: EventModel, idPostFix: string = '') => {
    return new EventModel({ ...event._pristine, id: `${idPostFix}${event.id}` }, event.store);
};

const ShiftAudience = observer((props: Props) => {
    const { events } = props;
    const eventStore = useStore('eventStore');
    const [shiftedYears, setShiftedYears] = React.useState(0);
    const [apiState, setApiState] = React.useState(ApiState.IDLE);
    const [shiftedEvent, setShiftedEvent] = React.useState<EventModel | null>(null);
    const [shifter, setShifter] = React.useState(
        new AudienceShifter(
            events.flatMap((e) => [...e.classes]),
            events.flatMap((e) => [...e.classGroups]),
            true,
            0
        )
    );
    React.useEffect(() => {
        const nShifter = new AudienceShifter(
            events.flatMap((e) => [...e.classes]),
            events.flatMap((e) => [...e.classGroups]),
            shifter.shiftAudienceInText,
            shifter.shiftedEventIdx
        );
        setShifter(nShifter);
        nShifter.shiftAudience(shiftedYears);
        const onChange = () => {
            const event = events[nShifter.shiftedEventIdx % events.length];
            if (event) {
                const clone = getClone(event, '---');
                const change = eventStore.shiftAudiencePatch([clone], nShifter);
                clone.update(change[0]);
                setShiftedEvent(clone);
            }
        };
        onChange();
        const disposer = reaction(
            () => `${nShifter.audience.toJSON()}${nShifter.shiftAudienceInText}${nShifter.shiftedEventIdx}`,
            onChange
        );
        return disposer;
    }, [events]);

    if (events.length === 0) {
        return <NoDraftEventsAlert onClose={props.onClose} />;
    }

    if (events.some((e) => !e.isDraft)) {
        return <DraftAlert onClose={props.onClose} />;
    }

    return (
        <div className={clsx(styles.shiftEditor, 'card')}>
            <div className={clsx('card__header')}>
                <h3 className={clsx(styles.header)}>
                    <Translate id="shiftAudienceEditor.title">
                        Neuzuordnung von Jahrgängen und Klassen
                    </Translate>
                </h3>
                <EditableDrafts count={events.length} />
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
                events={events}
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
                        eventStore.shiftEventAudience(events, shifter).then(() => {
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
    );
});

export default ShiftAudience;
