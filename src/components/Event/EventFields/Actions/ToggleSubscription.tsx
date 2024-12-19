import React from 'react';

import { observer } from 'mobx-react-lite';
import Button from '@site/src/components/shared/Button';
import { SIZE_S } from '@site/src/components/shared/icons';
import { useStore } from '@site/src/stores/hooks';
import { EventStateActions, EventStateButton, EventStateColor } from '@site/src/api/event';
import { translate } from '@docusaurus/Translate';
import Edit from './Edit';
import Event, { InvalidTransition } from '@site/src/models/Event';
import { mdiBellPlus, mdiBellRemove } from '@mdi/js';

export const InvalidTransitionMessages: Record<InvalidTransition, string> = {
    [InvalidTransition.InitialValidation]: translate({
        id: 'event.transition.invalid.initialValidation',
        message: 'Es wurde noch keine Validierung durchgeführt.'
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
}

const ToggleSubscription = observer((props: Props) => {
    const { event, size } = props;
    const userStore = useStore('userStore');
    const subscriptionStore = useStore('subscriptionStore');
    const { current } = userStore;
    if (!current) {
        return null;
    }
    const { subscription } = current;
    if (!subscription) {
        return null;
    }
    if (!subscription.subscribedEventIds.has(event.id)) {
        return null;
    }

    return (
        <Button
            text={
                event.isIgnored
                    ? translate({
                          id: 'subscription.unsubscribe',
                          message: 'Wieder anzeigen'
                      })
                    : translate({
                          id: 'subscription.unsubscribe',
                          message: 'Nicht mehr anzeigen'
                      })
            }
            icon={event.isIgnored ? mdiBellPlus : mdiBellRemove}
            color={event.isIgnored ? 'green' : 'red'}
            size={size || SIZE_S}
            iconSide="left"
            title={
                event.isIgnored
                    ? translate({
                          id: 'subscription.unsubscribe',
                          message: 'Diesen Termin wieder im persönlichen Kalender anzeigen.'
                      })
                    : translate({
                          id: 'subscription.subscribe',
                          message: 'Diesen Termin nicht mehr im persönlichen Kalender anzeigen.'
                      })
            }
            onClick={() => {
                if (event.isIgnored) {
                    event.resubscribe();
                } else {
                    event.unsubscribe();
                }
            }}
            apiState={subscriptionStore.apiStateFor(`save-${subscription.id}`)}
        />
    );
});

export default ToggleSubscription;
