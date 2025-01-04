import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as EventModel } from '@site/src/models/Event';
import { SIZE } from '../../../shared/icons';
import Translate, { translate } from '@docusaurus/Translate';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '../../../shared/Badge';
import { ApiState } from '@site/src/stores/iStore';
import AudienceShifter from './AudienceShifter';
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiCheckCircleOutline } from '@mdi/js';
import Button from '@site/src/components/shared/Button';

interface Props {
    events: EventModel[];
    close: () => void;
}

const getClone = (event: EventModel, idPostFix: string = '') => {
    return new EventModel({ ...event._pristine, id: `${idPostFix}${event.id}` }, event.store);
};

interface ShiftProps {
    audienceShifter: AudienceShifter;
    name: string;
}

const displayName = (name: string) => {
    if (name.length >= 4) {
        return name;
    }
    return `${name}*`;
};

const Shift = observer((props: ShiftProps) => {
    const { audienceShifter, name } = props;

    return (
        <div className={clsx(styles.shift)}>
            <Badge text={displayName(name)} className={clsx(styles.audienceBadge)} />
            <Icon path={mdiArrowRightBoldCircle} size={SIZE} color="var(--ifm-color-blue)" />
            <Badge
                text={displayName(audienceShifter.audience.get(name))}
                className={clsx(styles.audienceBadge)}
            />
        </div>
    );
});

const ShiftAudience = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    const [shifter, setShifter] = React.useState(
        new AudienceShifter(
            props.events.flatMap((e) => [...e.classes]),
            props.events.flatMap((e) => [...e.classGroups])
        )
    );
    const [shiftedYears, setShiftedYears] = React.useState(0);
    const [apiState, setApiState] = React.useState(ApiState.IDLE);
    React.useEffect(() => {
        const nShifter = new AudienceShifter(
            props.events.flatMap((e) => [...e.classes]),
            props.events.flatMap((e) => [...e.classGroups])
        );
        setShifter(nShifter);
        nShifter.shiftAudience(shiftedYears);
    }, [props.events]);

    return (
        <div className={clsx(styles.shiftEditor, 'card')}>
            <div className={clsx('card__header')}>
                <h3>
                    <Translate id="shiftAudienceEditor.title">
                        Neuzuordnung von Jahrgängen und Klassen
                    </Translate>
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
                            <Shift key={klass} audienceShifter={shifter} name={klass} />
                        ))}
                    </fieldset>
                </div>
            </div>
            {shiftedYears !== 0 && (
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
