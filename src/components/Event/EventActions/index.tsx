import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { DeleteIcon, DiscardIcon, EditIcon, SaveIcon } from '../../shared/icons';
import { EventState } from '@site/src/api/event';
import { action } from 'mobx';
import { mdiShareCircle } from '@mdi/js';
import { translate } from '@docusaurus/Translate';

type SortableButton = 'delete' | 'discard' | 'save' | 'open';

interface Props {
    event: Event;
    size?: number;
    buttonsWithText?: number;
    onDiscard?: () => void;
    buttonOrder?: SortableButton[];
    exclude?: SortableButton[];
}



const EventActions = observer((props: Props) => {
    const [deleteRequested, setDeleteRequested] = React.useState(false);
    const { event, size } = props;
    const eventStore = useStore('eventStore');
    const viewStore = useStore('viewStore');
    const buttons: {[key in SortableButton]: (props: {key: any, showText?: boolean}) => React.ReactNode} = {
        delete: ({key, showText}) => (<React.Fragment key={key}><Button
            color="red"
            iconSide='left'
            size={size}
            text={showText ? deleteRequested ? 'Wirklich?' : 'Löschen' : undefined}
            icon={<DeleteIcon size={size}/>}
            apiState={event.apiStateFor(`destroy-${event.id}`)}
            onClick={() => setDeleteRequested(!deleteRequested)}
        />
            {deleteRequested && (
                <Button color="red" text="Ja" size={size} onClick={() => event.destroy()} />
            )}
        </React.Fragment>),
        discard: ({key, showText}) => (
            <React.Fragment key={key}>
                {(event?.isDirty || event?.isEditing) && (
                    <Button
                        text={showText ? event.isDirty ? 'Verwerfen' : 'Abbrechen' : undefined}
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
                            }
                        }}
                    />
                )}
            </React.Fragment>
        ),
        open: ({key, showText}) => (
            <Button 
                key={`open-${key}`}
                color="blue"
                text={showText ? translate({message: 'Öffnen', id: 'button.open'}) : undefined}
                icon={mdiShareCircle}
                href={event.shareUrl}
            />
        ),
        save: ({key, showText}) => (
            <Button
                key={key}
                color="green"
                text={showText ? translate({message: 'Speichern', id: 'button.save', description: 'Button to save changes'}) : undefined}
                size={size}
                disabled={!event.isDirty || !event.isValid}
                title={event.isValid ? 'Änderungen speichern' : 'Fehler beheben vor dem Speichern'}
                icon={<SaveIcon size={size}/>}
                iconSide='left'
                onClick={() => {
                    if (event.state !== EventState.Draft) {
                        event.save().then(action((model) => {
                            const current = eventStore.find(event.id);
                            current?.reset();
                            if (model) {
                                viewStore.setEventModalId(model.id)
                            }
                        }))
                    } else {
                        event.save();
                    }
                }}
                apiState={event.apiStateFor(`save-${event.id}`)}
            />
        )
    }
    const buttonOrder = [...(props.buttonOrder ?? [])];
    ['delete', 'save', 'discard', 'open'].forEach((btn: SortableButton) => {
        if (!buttonOrder.includes(btn)) {
            buttonOrder.push(btn);
        }
    });
    const buttonsWithText = props.buttonsWithText ?? buttonOrder.length;
    if (event.isEditing) {
        return (
            <>
                {
                    buttonOrder.filter(b => !(props.exclude || []).includes(b))
                                .map((btn: SortableButton) => buttons[btn]({key: btn, showText: buttonsWithText >= buttonOrder.length}))
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
                    text={buttonsWithText >= 1 ? translate({message: 'Bearbeiten', id: 'button.edit', description: 'Button to edit a model'}) : undefined}
                    icon={<EditIcon size={size} />}
                    iconSide='left'
                    onClick={() => event.setEditing(true)}
                />
            )}
        </>
    )
});

export default EventActions;