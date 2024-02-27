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


interface Props {
    event: Event;
}

const DefaultEventActions = observer((props: Props) => {
    const { event } = props;
    const userStore = useStore('userStore');
    const viewStore = useStore('viewStore');
    return (
        <DefinitionList gridTemplateColumns='1fr 0.5fr'>
            <dt>
                <Translate
                    id="event.options.open"
                >
                    Öffnen
                </Translate>
            </dt>
            <dd>
                <Button
                    title='Übersicht Öffnen'
                    icon={mdiArrowExpandAll}
                    color="blue"
                    size={SIZE_S}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        viewStore.setEventModalId(event.id);
                    }}
                />
            </dd>
            <dt>
                <Translate
                    id="event.options.share"
                >
                    Teilen
                </Translate>
            </dt>
            <dd>
                <Button
                    color="blue"
                    icon={mdiShareCircle}
                    href={event.shareUrl}
                    size={SIZE_S}
                    title={translate({
                        message: 'Öffnen',
                        id: 'event.open.title',
                        description: 'Button Title (hover) to open an event view'
                    })}
                />
            </dd>
            <dt>
                <Translate
                    id="event.options.edit"
                >
                    Bearbeiten
                </Translate>
            </dt>
            <dd>
                <EditRowMode event={event} />
            </dd>
            <dt>
                <Translate
                    id="event.options.clone"
                >
                    Duplizieren
                </Translate>
            </dt>
            <dd>
                <Clone event={event} />
            </dd>
            <dt>
                <Translate
                    id="event.options.group"
                >
                    Gruppe
                </Translate>
            </dt>
            <dd>
                <AddToGroup event={event} />
            </dd>
            {
                (userStore.current?.isAdmin || userStore.current?.id === event.authorId) && (
                    <>
                        <dt>
                            <Translate
                                id="event.options.delete"
                            >
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
                )
            }
        </DefinitionList>
    )
});

export default DefaultEventActions;