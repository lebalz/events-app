import React from 'react';

import { observer } from 'mobx-react-lite';
import Button from '@site/src/components/shared/Button';
import { SIZE_S } from '@site/src/components/shared/icons';
import { useStore } from '@site/src/stores/hooks';
import { EventStateActions, EventStateButton, EventStateColor } from '@site/src/api/event';
import { translate } from '@docusaurus/Translate';
import Edit from './Edit';
import Event, { InvalidTransition } from '@site/src/models/Event';
import ValidationChecker from '../../BulkActions/ValidationChecker';
import { ApiState } from '@site/src/stores/iStore';

export const InvalidTransitionMessages: Record<InvalidTransition, string> = {
    [InvalidTransition.InitialValidation]: translate({
        id: 'event.transition.invalid.initialValidation',
        message: 'Es wurde noch keine Validierung durchgeführt.'
    }),
    [InvalidTransition.NotAllowed]: translate({
        id: 'event.transition.invalid.notAllowed',
        message: 'Nicht erlaubter Terminübergang.'
    }),
    [InvalidTransition.Validation]: translate({
        id: 'event.transition.invalid.validation',
        message: 'Fehlerhafte Termine können nicht eingereicht werden.'
    }),
    [InvalidTransition.NoOpenRegistrationPeriod]: translate({
        id: 'event.transition.invalid.noOpenRegistrationPeriod',
        message: 'Aktuell ist kein Anmeldefenster geöffnet.'
    })
};

interface Props {
    event: Event;
    size?: number;
    ensureValidation?: boolean;
}

const Transition = observer((props: Props) => {
    const { event, size } = props;
    const eventStore = useStore('eventStore');
    if (event.isEditable && event.isEditing) {
        return <Edit {...props} />;
    }
    return (
        <>
            {props.ensureValidation && <ValidationChecker events={[event]} noLoader />}
            {event.possibleStates.map((state, idx) => {
                const { allowed: can, reason } = event.transitionAllowed;
                return (
                    <Button
                        key={state}
                        text={EventStateActions[state]}
                        icon={EventStateButton[state]}
                        color={EventStateColor[state]}
                        size={size || SIZE_S}
                        iconSide="left"
                        disabled={!can}
                        title={reason ? `⚠️ ${InvalidTransitionMessages[reason]}` : undefined}
                        onClick={() => {
                            event.requestState(state);
                        }}
                        apiState={
                            can || event.initialValidation
                                ? eventStore.apiStateFor(`save-state-${state}-${event.id}`)
                                : ApiState.LOADING
                        }
                    />
                );
            })}
        </>
    );
});

export default Transition;
