import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { translate } from '@docusaurus/Translate';
import { mdiArrowExpandAll, mdiShareCircle } from '@mdi/js';
import { DiscardIcon, SIZE, SaveIcon, SaveVersionIcon } from '../../shared/icons';
import { AddToGroup, Clone, EditRowMode } from './OptionsPopup';
import Event from '@site/src/models/Event';
import Delete from '../../shared/Button/Delete';
import { EventState } from '@site/src/api/event';
import { action } from 'mobx';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface Props {
    event: Event;
    closePopup?: () => void;
    className?: string;
    hideDelete?: boolean;
    hideEdit?: boolean;
    hideOpen?: boolean;
    rightActions?: React.ReactNode | React.ReactNode[];
}

const BTN_SIZE = SIZE;

const DefaultActions = observer((props: Props) => {
    const { event } = props;
    const userStore = useStore('userStore');
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const sessionStore = useStore('sessionStore');
    const { current } = userStore;
    const shareUrl = useBaseUrl(event.shareUrl);
    const { isLoggedIn } = sessionStore;
    return (
        <div className={clsx(styles.defaultButtons, props.className)}>
            {!props.hideOpen && viewStore.openEventModalId !== event.id && (
                <Button
                    title={translate({
                        message: 'Übersicht Öffnen',
                        id: 'event.options.open.overview',
                        description: 'Text of the button open overview'
                    })}
                    icon={mdiArrowExpandAll}
                    color="primary"
                    size={BTN_SIZE}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (props.closePopup) {
                            props.closePopup();
                        }
                        viewStore.setEventModalId(event.id);
                    }}
                />
            )}
            <Button
                color="blue"
                icon={mdiShareCircle}
                href={shareUrl}
                size={BTN_SIZE}
                title={translate({
                    message: 'Terminseite Anzeigen',
                    id: 'button.open.title'
                })}
            />
            {isLoggedIn && !(props.hideEdit || event.isEditing) && !event.isDeleted && (
                <EditRowMode event={event} onClosePopup={props.closePopup} iconSize={BTN_SIZE} />
            )}
            {isLoggedIn && (
                <>
                    <Clone event={event} iconSize={BTN_SIZE} onClosePopup={props.closePopup} />
                    <AddToGroup event={event} iconSize={BTN_SIZE} />
                </>
            )}
            {isLoggedIn && event.isEditing && (
                <>
                    <Button
                        title={
                            event.isDirty
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
                        }
                        color="black"
                        size={BTN_SIZE}
                        icon={<DiscardIcon size={BTN_SIZE} />}
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
                            event.canSave
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
                        size={BTN_SIZE}
                        disabled={!event.isDirty || !event.canSave}
                        icon={
                            event.isDraft ? <SaveIcon size={BTN_SIZE} /> : <SaveVersionIcon size={BTN_SIZE} />
                        }
                        iconSide="left"
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
            )}
            {isLoggedIn && (current?.id === event.authorId || current?.isAdmin) && !event.isDeleted && (
                <Delete
                    onClick={() => event.destroy()}
                    apiState={event.apiStateFor(`destroy-${event.id}`)}
                    size={BTN_SIZE}
                />
            )}
            {props.rightActions}
        </div>
    );
});

export default DefaultActions;
