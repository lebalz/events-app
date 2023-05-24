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
import { DeleteIcon, DiscardIcon, EditIcon, SaveIcon } from '../../shared/icons';
import EventActions from '../EventActions';


interface Props {
}

const EventModal = observer((props: Props) => {
    const [deleteRequested, setDeleteRequested] = React.useState(false);
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const { openEventModalId } = viewStore;
    const event = eventStore.find<EventModel>(openEventModalId);
    return (
        <Modal
            open={!!event}
            onClose={() => viewStore.setEventModalId()}
        >
            <div className={clsx(styles.card, 'card')}>
                <div className={clsx('card__body')}>
                    {event && (
                        <Event event={event} inModal />
                    )}
                </div>
                <div className={clsx('card__footer')}>
                    <div className={clsx('button-group button-group--block')}>
                        {event?.isEditing ? (
                            <EventActions event={event} onDiscard={() => viewStore.setEventModalId()} />
                        ) : (
                            <>
                                <Button color="red" text="Schliessen" icon={mdiClose} iconSide='left' onClick={() => viewStore.setEventModalId()} />
                                <EventActions event={event} />
                                <Button color="blue" text="Öffnen" icon={mdiShareCircle}  href={event?.shareUrl} target="_self" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
});

export default EventModal;