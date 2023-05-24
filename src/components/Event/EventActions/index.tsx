import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { DeleteIcon, DiscardIcon, EditIcon, SaveIcon } from '../../shared/icons';

type SortableButton = 'delete' | 'discard' | 'save';

interface Props {
    event: Event;
    onDiscard?: () => void;
    buttonOrder?: SortableButton[];
}



const EventActions = observer((props: Props) => {
    const [deleteRequested, setDeleteRequested] = React.useState(false);
    const { event } = props;
    const buttons: {[key in SortableButton]: (props: {key: any}) => React.ReactNode} = {
        delete: ({key}) => (<React.Fragment key={key}><Button
            color="red"
            iconSide='left'
            text={deleteRequested ? 'Wirklich?' : 'Löschen'}
            icon={<DeleteIcon />}
            apiState={event.apiStateFor(`destroy-${event.id}`)}
            onClick={() => setDeleteRequested(!deleteRequested)}
        />
            {deleteRequested && (
                <Button color="red" text="Ja" onClick={() => event.destroy()} />
            )}
        </React.Fragment>),
        discard: ({key}) => (
            <React.Fragment key={key}>
                {(event?.isDirty || event?.isEditing) && (
                    <Button
                        text={event.isDirty ? 'Verwerfen' : 'Schliessen'}
                        color="black"
                        title="Änderungen verwerfen"
                        icon={<DiscardIcon />}
                        iconSide='left'
                        onClick={() => {
                            if (event.isDirty) {
                                event.reset(false);
                            } else {
                                event.setEditing(false);
                                props.onDiscard?.();
                            }
                        }}
                    />
                )}
            </React.Fragment>
        ),
        save: ({key}) => (
            <Button
                key={key}
                color="green"
                text="Speichern"
                disabled={!event.isDirty}
                icon={<SaveIcon />}
                onClick={() => event.save()}
                apiState={event.apiStateFor(`save-${event.id}`)}
            />
        )
    }
    const buttonOrder = [...(props.buttonOrder ?? [])];
    ['delete', 'discard', 'save'].forEach((btn: SortableButton) => {
        if (!buttonOrder.includes(btn)) {
            buttonOrder.push(btn);
        }
    });
    if (event.isEditing) {
        return (
            <>
                {
                    buttonOrder.map((btn: SortableButton) => buttons[btn]({key: btn}))
                }
            </>
        )
    }
    return (
        <>
            {event?.isEditable && (
                <Button
                    color="orange"
                    text="Bearbeiten"
                    icon={<EditIcon />}
                    iconSide='left'
                    onClick={() => event.setEditing(true)}
                />
            )}
        </>
    )
});

export default EventActions;