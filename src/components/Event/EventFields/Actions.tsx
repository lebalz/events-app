import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Button from '@site/src/components/shared/Button';
import { mdiArrowExpandAll, mdiArrowExpandUp, mdiArrowExpandVertical, mdiShareCircle } from '@mdi/js';
import { Icon, SIZE_S } from '@site/src/components/shared/icons';
import Discard from '@site/src/components/shared/Button/Discard';
import Save from '@site/src/components/shared/Button/Save';
import Delete from '@site/src/components/shared/Button/Delete';
import Edit from '@site/src/components/shared/Button/Edit';
import { useStore } from '@site/src/stores/hooks';
import {useWindowSize} from '@docusaurus/theme-common';
import { EventState } from '@site/src/api/event';
import { useHistory } from '@docusaurus/router';
import { action } from 'mobx';
import { translate } from '@docusaurus/Translate';

interface Props extends ReadonlyProps {
    hideShare?: boolean;
}

const Actions = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const windowSize = useWindowSize();
    return (
        <div
            style={{ gridColumn: 'actions' }}
            className={clsx(props.className, styles.actions, 'grid-actions')}
        >
            <div className={clsx(styles.flex)}>
                <Button
                    title='Übersicht Öffnen'
                    icon={<Icon path={mdiArrowExpandAll} color="blue" size={SIZE_S} />}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        viewStore.setEventModalId(event.id);
                    }}
                />
                {
                    event.isEditable && (event.state === EventState.Draft || (props.expandeable && event.isExpanded)) && !event.isEditing && (
                        <Edit onClick={() => {
                            event.setEditing(true);
                            if (windowSize === 'mobile') {
                                viewStore.setEventModalId(event.id)
                            }
                        }} />
                    )
                }
                {
                    event.isEditing && (
                        <>
                            <Discard onClick={() => event.reset()} />
                            <Save
                                disabled={!event.isDirty || !event.isValid}
                                title={event.isValid 
                                    ? event.isDraft 
                                        ? 'Änderungen speichern'
                                        : 'Als neue Version speichern (kann als Änderungsvorschlag eingereicht werden)'
                                    : 'Fehler beheben vor dem Speichern'
                                }
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
                            <Delete onClick={() => event.destroy()} apiState={event.apiStateFor(`destroy-${event.id}`)} />
                        </>
                    )
                }
            </div>
            <div className={clsx(styles.expand, styles.flex)}>
                {
                    props.expandeable && event.isExpanded && !event.isEditing && (
                        <>
                            <Button 
                                icon={mdiArrowExpandUp} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    event.setExpanded(false)
                                }} 
                                size={SIZE_S} 
                            />
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
                        </>
                    )
                }
            </div>
        </div>
    )
});

export default Actions;