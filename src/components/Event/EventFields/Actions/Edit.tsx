import React from 'react';
import clsx from 'clsx';
import sharedStyles from '../styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from '../iEventField';
import Discard from '@site/src/components/shared/Button/Discard';
import Save from '@site/src/components/shared/Button/Save';
import Delete from '@site/src/components/shared/Button/Delete';
import { useStore } from '@site/src/stores/hooks';
import { EventState } from '@site/src/api/event';
import { action } from 'mobx';
import OptionsPopup from '../../EventActions/OptionsPopup';

interface Props extends ReadonlyProps {
    hideShare?: boolean;
}

const Edit = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    if (!event.isEditable || !event.isEditing) {
        return null;
    }
    return (
        <div
            style={{ gridColumn: 'actions' }}
            className={clsx(props.className, sharedStyles.actions, 'grid-actions')}
        >
            <div className={clsx(sharedStyles.flex)}>
                <OptionsPopup event={event} hideEdit />
                <Discard
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        event.reset();
                    }}
                />
                <Save
                    disabled={!event.isDirty || !event.canSave}
                    title={
                        event.canSave
                            ? event.isDraft
                                ? 'Änderungen speichern'
                                : 'Als neue Version speichern (kann als Änderungsvorschlag eingereicht werden)'
                            : 'Fehler beheben vor dem Speichern'
                    }
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
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
                <Delete onClick={() => event.destroy()} apiState={event.apiStateFor(`destroy-${event.id}`)} />
            </div>
        </div>
    );
});

export default Edit;
