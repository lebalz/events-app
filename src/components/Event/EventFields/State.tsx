import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';
import { EventState } from '@site/src/api/event';
import { mdiBookCancel, mdiDeleteForever, mdiFileCertificate, mdiPencilBox, mdiProgressCheck } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { Color } from '@site/src/components/shared/Badge';
import { SIZE_S, SIZE_XS } from '@site/src/components/shared/icons';

const StateButton: {[state in EventState]: string} = {
    [EventState.Deleted]: mdiDeleteForever,
    [EventState.Draft]: mdiPencilBox,
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