import React from 'react';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { DiscardIcon, SaveIcon } from '../../shared/icons';
import { EventState } from '@site/src/api/event';
import { action } from 'mobx';
import { translate } from '@docusaurus/Translate';

type SortableButton = 'delete' | 'discard' | 'save' | 'open';

interface Props {
    event: Event;
    size?: number;
    expandedButtons?: number;
    onDiscard?: () => void;
    buttonOrder?: SortableButton[];
    exclude?: SortableButton[];
}

const ModalFooterEventActions = observer((props: Props) => {
    const { event, size } = props;
    const eventStore = useStore('eventStore');
    const viewStore = useStore('viewStore');

    const buttonsWithText = props.expandedButtons ?? 2;
    const showText = buttonsWithText >= 2;
    return (
        <>
            <Button
                text={
                    showText
                        ? event.isDirty
                            ? translate({
                                  message: 'Verwerfen',
                                  id: 'components.event.actions.discard',
                                  description: 'Text of the button discard'
                              })
                            : translate({
                                  message: 'Abbrechen',
                                  id: 'components.event.actions.cancel',
                                  description: 'Text of the button cancel'
                              })
                        : undefined
                }
                color="black"
                size={size}
                noWrap
                title={
                    event.isDirty
                        ? translate({
                              message: 'Änderungen verwerfen',
                              id: 'components.event.actions.cancel.title',
                              description: 'Title of the button cancel'
                          })
                        : translate({
                              id: 'components.event.actions.close-edit.title',
                              message: 'Editiermodus beenden'
                          })
                }
                icon={<DiscardIcon size={size} />}
                iconSide="left"
                onClick={() => {
                    if (event.isDirty) {
                        event.reset(false);
                    } else {
                        event.setEditing(false);
                    }
                }}
            />
            <Button
                color="green"
                text={
                    showText
                        ? translate({
                              message: 'Speichern',
                              id: 'button.save',
                              description: 'Button to save changes'
                          })
                        : undefined
                }
                size={size}
                disabled={!event.isDirty || !event.canSave}
                title={event.canSave ? 'Änderungen speichern' : 'Fehler beheben vor dem Speichern'}
                icon={<SaveIcon size={size} />}
                iconSide="left"
                noWrap
                onClick={() => {
                    if (event.state !== EventState.Draft) {
                        event.save().then(
                            action((model) => {
                                const current = eventStore.find(event.id);
                                current?.reset();
                                if (model) {
                                    viewStore.setEventModalId(model.id);
                                }
                            })
                        );
                    } else {
                        event.save();
                    }
                }}
                apiState={event.apiStateFor(`save-${event.id}`)}
            />
        </>
    );
});

export default ModalFooterEventActions;
