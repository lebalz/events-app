import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import DatePicker from '../../../shared/DatePicker';
import { default as EventModel } from '@site/src/models/Event';
import Icon from '@mdi/react';
import { mdiArrowRightBoldCircle, mdiCheckCircleOutline } from '@mdi/js';
import { ArrowLeft, ArrowRight, SIZE, SIZE_S } from '../../../shared/icons';
import { toGlobalDate } from '@site/src/models/helpers/time';
import Select from 'react-select';
import Translate, { translate } from '@docusaurus/Translate';
import Button from '../../../shared/Button';
import { EventStateButton, EventStateColor } from '@site/src/api/event';
import Badge from '../../../shared/Badge';
import { ApiState } from '@site/src/stores/iStore';
import DiffViewer from '../../../Event/DiffViewer';
import Preview from '../Preview';

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

const ShiftAudience = observer((props: Props) => {
    const { events } = props;

    const [apiState, setApiState] = React.useState(ApiState.IDLE);
    const eventStore = useStore('eventStore');

    const classes = [...new Set(events.flatMap((e) => [...e.classes]))].sort();
    const groups = [...new Set(events.flatMap((e) => [...e.classGroups]))].sort();

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
                    <fieldset className={clsx(styles.groups)}>
                        <legend>
                            <Translate id="shiftAudienceEditor.groups">Jahrgänge</Translate>
                        </legend>
                        {groups.map((group) => (
                            <Badge key={group} size={SIZE_S} text={group} />
                        ))}
                    </fieldset>
                    <fieldset className={clsx(styles.classes)}>
                        <legend>
                            <Translate id="shiftAudienceEditor.classes">Klassen</Translate>
                        </legend>
                        {classes.map((klass) => (
                            <Badge key={klass} size={SIZE_S} text={klass} />
                        ))}
                    </fieldset>
                </div>
            </div>
        </div>
    );
});

export default ShiftAudience;
