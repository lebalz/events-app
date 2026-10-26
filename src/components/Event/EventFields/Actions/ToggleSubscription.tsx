import { translate } from '@docusaurus/Translate';
import { mdiBellPlus, mdiBellRemove } from '@mdi/js';
import Button from '@site/src/components/shared/Button';
import { SIZE } from '@site/src/components/shared/icons';
import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';

interface Props {
    event: Event;
    size?: number;
    hideText?: boolean;
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
                props.hideText
                    ? undefined
                    : event.isIgnored
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
            size={size || SIZE}
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
            apiIconSize={size || SIZE}
        />
    );
});

export default ToggleSubscription;
