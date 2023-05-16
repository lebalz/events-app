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

const StateButton: {[state in EventState]: string} = {
    [EventState.Deleted]: mdiDeleteForever,
    [EventState.Draft]: mdiPen,
    [EventState.Published]: mdiFileCertificate,
    [EventState.Refused]: mdiBookCancel,
    [EventState.Review]: mdiProgressCheck
}

const StateColor: {[state in EventState]: Color} = {
    [EventState.Deleted]: 'red',
    [EventState.Draft]: 'blue',
    [EventState.Published]: 'green',
    [EventState.Refused]: 'red',
    [EventState.Review]: 'orange'

}

const State = observer((props: ReadonlyProps) => {
    const { styles } = props;
    return (
        <div 
            style={{gridColumn: 'state'}} 
            className={clsx('state', styles.state, props.className, 'grid-isValid')}
        >
            <Badge icon={StateButton[props.event.state]} color={StateColor[props.event.state]} size={SIZE_S} />
        </div>
    )
});

export default State;