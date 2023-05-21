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
import Discard from '../../shared/Button/Discard';
import Save from '../../shared/Button/Save';
import { DeleteIcon, DiscardIcon, EditIcon, SaveIcon } from '../../shared/icons';
import Delete from '../../shared/Button/Delete';


interface Props {
    trigger?: React.ReactNode;
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
                        {event?.isEditing ? (
                            <>
                                <Button color="red" iconSide='left' text={deleteRequested ? 'Wirklich?' : 'Löschen'} icon={<DeleteIcon />} apiState={event.apiStateFor(`destroy-${event.id}`)} onClick={() => setDeleteRequested(!deleteRequested)} />
                                {deleteRequested && (
                                    <Button color="red" text="Ja" onClick={() => event.destroy()} />
                                )}
                                {(event?.isDirty || event?.isEditing) && (
                                    <Button text={event.isDirty ? 'Verwerfen': 'Schliessen'} color="black" title="Änderungen verwerfen" icon={<DiscardIcon />} iconSide='left' onClick={() => {
                                        if (event.isDirty) {
                                            event.reset(false);
                                        } else {
                                            event.setEditing(false);
                                            viewStore.setEventModalId();
                                        }
                                    }} />
                                )}
                                <Button color="green" text="Speichern" disabled={!event.isDirty} icon={<SaveIcon />}  onClick={() => event.save()} apiState={event.apiStateFor(`save-${event.id}`)} />

                            </>
                        ) : (
                            <>
                                <Button color="red" text="Schliessen" icon={mdiClose} iconSide='left' onClick={() => viewStore.setEventModalId()} />
                                {event?.isEditable && (
                                    <Button color="orange" text="Bearbeiten" icon={<EditIcon />} iconSide='left' onClick={() => event.setEditing(true)} />
                                )}
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