import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Modal from '../../shared/Modal';
import {default as EventModel} from '@site/src/models/Event';
import Event from '..';
import Button from '../../shared/Button';
import { mdiClose, mdiShareCircle } from '@mdi/js';


interface Props {
    trigger?: React.ReactNode;
}

const EventModal = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const { openEventModalId } = viewStore;
    const event = eventStore.find<EventModel>(openEventModalId);
    return (
        <Modal
            open={!!event}
            onClose={() => viewStore.setEventModalId()}
            trigger={props.trigger ?? null}
        >
            <div className={clsx(styles.card, 'card')}>
                <div className={clsx('card__body')}>
                    {event && (
                        <Event event={event} />
                    )}
                </div>
                <div className={clsx('card__footer')}>
                    <div className={clsx('button-group button-group--block')}>
                        <Button color="red" text="Schliessen" icon={mdiClose} iconSide='left' onClick={() => viewStore.setEventModalId()} />
                        <Button color="blue" text="Öffnen" icon={mdiShareCircle}  href={event?.shareUrl} target="_self" />
                    </div>
                </div>
            </div>
        </Modal>
    )
});

export default EventModal;