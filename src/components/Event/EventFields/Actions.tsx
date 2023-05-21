import React, { type ReactNode } from 'react';
import clsx from 'clsx';

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

interface Props extends ReadonlyProps {
    hideShare?: boolean;
}

const Actions = observer((props: Props) => {
    const { event, styles } = props;
    const viewStore = useStore('viewStore');
    return (
        <div
            style={{ gridColumn: 'actions' }}
            className={clsx(props.className, styles.actions, 'grid-actions')}
        >
            <div className={clsx(styles.flex)}>

                {!props.hideShare && (
                    <>
                        {event.isEditing ? (
                            <Button
                                title='Übersicht Öffnen'
                                icon={<Icon path={mdiArrowExpandAll} color="blue" size={SIZE_S} />}
                                onClick={() => viewStore.setEventModalId(event.id)}
                            />
                        ) : (
                            <Button
                                icon={<Icon path={mdiShareCircle} color="blue" size={SIZE_S} />}
                                href={event.shareUrl}
                                target="_self"
                            />
                        )}
                    </>
                )}
                {
                    event.isEditable && !event.isEditing && (
                        <Edit onClick={() => event.setEditing(true)} />
                    )
                }
                {
                    event.isEditing && (
                        <>
                            <Discard onClick={() => event.reset()} />
                            <Save
                                disabled={!event.isDirty}
                                onClick={() => event.save()}
                                apiState={event.apiStateFor(`save-${event.id}`)}
                            />
                            <Delete onClick={() => event.destroy()} apiState={event.apiStateFor(`destroy-${event.id}`)} />
                        </>
                    )
                }
            </div>
            <div className={clsx(styles.expand)}>
                {
                    props.expandeable && event.isExpanded && !event.isEditing && (
                        <Button icon={mdiArrowExpandUp} onClick={() => event.setExpanded(false)} size={SIZE_S} />
                    )
                }
            </div>
        </div>
    )
});

export default Actions;