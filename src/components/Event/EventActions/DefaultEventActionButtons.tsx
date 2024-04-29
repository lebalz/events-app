import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { translate } from '@docusaurus/Translate';
import { mdiArrowExpandAll, mdiShareCircle } from '@mdi/js';
import { DiscardIcon, SIZE_S, SaveIcon } from '../../shared/icons';
import { AddToGroup, Clone, EditRowMode } from './OptionsPopup';
import Event from '@site/src/models/Event';
import Delete from '../../shared/Button/Delete';
import { EventState } from '@site/src/api/event';
import { action } from 'mobx';


interface Props {
    event: Event;
    closePopup?: () => void;
    className?: string;
    hideDelete?: boolean;
    hideEdit?: boolean;
}

const DefaultEventActionsButtons = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    return (
        <div className={clsx(styles.defaultButtons, props.className)}>
            <Button
                title={translate({
                    message: 'Übersicht Öffnen',
                    id: 'event.options.open.overview',
                    description: "Text of the button open overview"
                })}
                icon={mdiArrowExpandAll}
                color="blue"
                size={SIZE_S}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (props.closePopup) {
                        props.closePopup();
                    }
                    viewStore.setEventModalId(event.id);
                }}
            />
            <Button
                color="blue"
                icon={mdiShareCircle}
                href={event.shareUrl}
                size={SIZE_S}
                title={translate({
                    message: 'Terminseite Anzeigen',
                    id: 'button.open.title'
                })}
            />
            {(props.hideEdit || !event.isEditing) && (
                <EditRowMode event={event} onEdit={props.closePopup} />
            )}
            <Clone event={event} />
            <AddToGroup event={event} />
            {event.isEditing && (
                <>
                    <Button
                        title={
                            event.isDirty 
                            ? translate({
                                    message : 'Verwerfen',
                                    id : "components.event.actions.discard",
                                    description : "Text of the button discard"
                                })
                            : translate({
                                    message : 'Abbrechen',
                                    id : "components.event.actions.cancel",
                                    description : "Text of the button cancel"
                                })
                        }
                        color="black"
                        size={SIZE_S}
                        icon={<DiscardIcon size={SIZE_S} />}
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
                        title={
                            event.isValid
                                ? event.isDraft
                                    ? translate({
                                        message: 'Änderungen Speichern',
                                        id: 'button.save',
                                        description: 'Button to save changes'
                                    })
                                    : translate({
                                        message: 'Neue, unveröffentlichte Version Speichern',
                                        id: 'button.save.new-version'
                                    })
                                : translate({
                                    message: 'Fehler beheben vor dem Speichern',
                                    id: 'button.save.error',
                                    description: 'Button to save changes with error'
                                })
                        }
                        size={SIZE_S}
                        disabled={!event.isDirty || !event.isValid}
                        icon={<SaveIcon size={SIZE_S} newVersion={!event.isDraft} />}
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
                    <Delete
                        onClick={() => event.destroy()}
                        apiState={event.apiStateFor(`destroy-${event.id}`)}
                    />
                </>
            )}
        </div>
    )
});

export default DefaultEventActionsButtons;