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
    size?: number;
    onDiscard?: () => void;
    buttonOrder?: SortableButton[];
}



const EventActions = observer((props: Props) => {
    const [deleteRequested, setDeleteRequested] = React.useState(false);
    const { event, size } = props;
    const buttons: {[key in SortableButton]: (props: {key: any}) => React.ReactNode} = {
        delete: ({key}) => (<React.Fragment key={key}><Button
            color="red"
            iconSide='left'
            size={size}
            text={deleteRequested ? 'Wirklich?' : 'Löschen'}
            icon={<DeleteIcon size={size}/>}
            apiState={event.apiStateFor(`destroy-${event.id}`)}
            onClick={() => setDeleteRequested(!deleteRequested)}
        />
            {deleteRequested && (
                <Button color="red" text="Ja" size={size} onClick={() => event.destroy()} />
            )}
        </React.Fragment>),
        discard: ({key}) => (
            <React.Fragment key={key}>
                {(event?.isDirty || event?.isEditing) && (
                    <Button
                        text={event.isDirty ? 'Verwerfen' : 'Schliessen'}
                        color="black"
                        size={size}
                        title="Änderungen verwerfen"
                        icon={<DiscardIcon size={size}/>}
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
                size={size}
                disabled={!event.isDirty || !event.isValid}
                title={event.isValid ? 'Änderungen speichern' : 'Fehler beheben vor dem Speichern'}
                icon={<SaveIcon size={size}/>}
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
                    size={size}
                    color="orange"
                    text="Bearbeiten"
                    icon={<EditIcon size={size} />}
                    iconSide='left'
                    onClick={() => event.setEditing(true)}
                />
            )}
        </>
    )
});

export default EventActions;