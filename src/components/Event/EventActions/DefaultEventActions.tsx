import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import DefinitionList from '../../shared/DefinitionList';
import Translate, { translate } from '@docusaurus/Translate';
import { AddToGroup, Clone, EditRowMode } from './OptionsPopup';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { mdiArrowExpandAll, mdiShareCircle } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import Delete from '../../shared/Button/Delete';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface Props {
    event: Event;
    closePopup?: () => void;
    hideEdit?: boolean;
}

const DefaultEventActions = observer((props: Props) => {
    const { event } = props;
    const userStore = useStore('userStore');
    const viewStore = useStore('viewStore');
    return (
        <DefinitionList gridTemplateColumns="1fr 0.5fr">
            {viewStore.openEventModalId !== event.id && (
                <>
                    <dt>
                        <Translate id="event.options.open" description="Text of the button open">
                            Öffnen
                        </Translate>
                    </dt>
                    <dd>
                        <Button
                            title={translate({
                                message: 'Übersicht Öffnen',
                                id: 'event.options.open.overview',
                                description: 'Text of the button open overview'
                            })}
                            icon={mdiArrowExpandAll}
                            color="primary"
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
                    </dd>
                </>
            )}
            <dt>
                <Translate id="event.options.share">Teilen</Translate>
            </dt>
            <dd>
                <Button
                    color="blue"
                    icon={mdiShareCircle}
                    href={useBaseUrl(event.shareUrl)}
                    size={SIZE_S}
                    title={translate({
                        message: 'Terminseite Anzeigen',
                        id: 'button.open.title'
                    })}
                />
            </dd>
            {!props.hideEdit && (
                <>
                    <dt>
                        <Translate id="event.options.edit" description="Text of the button edit">
                            Bearbeiten
                        </Translate>
                    </dt>
                    <dd>
                        <EditRowMode event={event} onEdit={props.closePopup} />
                    </dd>
                </>
            )}
            <dt>
                <Translate id="event.options.clone" description="Text of the button clone">
                    Duplizieren
                </Translate>
            </dt>
            <dd>
                <Clone event={event} />
            </dd>
            <dt>
                <Translate id="event.options.group" description="Text of the button group">
                    Gruppe
                </Translate>
            </dt>
            <dd>
                <AddToGroup event={event} />
            </dd>
            {(userStore.current?.isAdmin || userStore.current?.id === event.authorId) && (
                <>
                    <dt>
                        <Translate id="event.options.delete" description="Text of the button delete">
                            Löschen
                        </Translate>
                    </dt>
                    <dd>
                        <Delete
                            onClick={() => event.destroy()}
                            apiState={event.apiStateFor(`destroy-${event.id}`)}
                        />
                    </dd>
                </>
            )}
        </DefinitionList>
    );
});

export default DefaultEventActions;
