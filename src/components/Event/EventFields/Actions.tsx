import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Button from '@site/src/components/shared/Button';
import { mdiArrowExpandUp } from '@mdi/js';
import { SIZE_S } from '@site/src/components/shared/icons';
import Discard from '@site/src/components/shared/Button/Discard';
import Save from '@site/src/components/shared/Button/Save';
import Delete from '@site/src/components/shared/Button/Delete';
import { useStore } from '@site/src/stores/hooks';
import {useWindowSize} from '@docusaurus/theme-common';
import { EventState } from '@site/src/api/event';
import { action } from 'mobx';
import { translate } from '@docusaurus/Translate';
import OptionsPopup, {  } from '../EventActions/OptionsPopup';

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
                <OptionsPopup event={event} />
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
                                    e.preventDefault();
                                    e.stopPropagation();
                                    event.setExpanded(false)
                                }}
                                size={SIZE_S} 
                                title={translate({
                                    message: 'Auf eine Zeile reduzieren',
                                    id: 'event.reduce.title',
                                    description: 'Button Title (hover) to reduce an expanded event in the table view'
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