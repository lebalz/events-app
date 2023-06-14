import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';
import { EventState } from '@site/src/api/event';
import { mdiBookCancel, mdiDeleteForever, mdiFileCertificate, mdiPen, mdiPencilBox, mdiProgressCheck } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { SIZE_S } from '@site/src/components/shared/icons';
import { Color } from '../../shared/Colors';
import Event from '@site/src/models/Event';

const StateButton: {[state in EventState]: string} = {
    [EventState.Draft]: mdiPen,
    [EventState.Published]: mdiFileCertificate,
    [EventState.Refused]: mdiBookCancel,
    [EventState.Review]: mdiProgressCheck
}

const StateColor: {[state in EventState]: Color} = {
    [EventState.Draft]: 'blue',
    [EventState.Published]: 'green',
    [EventState.Refused]: 'red',
    [EventState.Review]: 'orange'
}

const StateTitle: {[state in EventState]: string} = {
    [EventState.Draft]: 'Unveröffentlicht',
    [EventState.Published]: 'Veröffentlicht',
    [EventState.Refused]: 'Zurückgewiesen',
    [EventState.Review]: 'Im Review'
}

const State = observer((props: ReadonlyProps) => {
    const { styles, onClick, event } = props;
    return (
        <div 
            style={{gridColumn: 'state'}} 
            className={clsx('state', styles.state, props.className, 'grid-isValid')}
            onClick={onClick}
        >
            <Badge icon={StateButton[event.state]} color={StateColor[event.state]} size={SIZE_S} title={StateTitle[event.state]} />
            {
                event.isDeleted && (
                    <Badge 
                        icon={mdiDeleteForever} 
                        color="red" 
                        size={SIZE_S} 
                        title={`Gelöscht am ${Event.fDate(event.deletedAt)}`}
                        text={Event.fDate(event.deletedAt)}
                        iconSide='left'
                    />
                )
            }
        </div>
    )
});

export default State;