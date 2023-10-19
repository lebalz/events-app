import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import { EventStateButton, EventStateColor, EventStateTranslation } from '@site/src/api/event';
import { mdiDeleteForever } from '@mdi/js';
import Badge from '@site/src/components/shared/Badge';
import { SIZE_S } from '@site/src/components/shared/icons';
import Event from '@site/src/models/Event';

interface Props extends ReadonlyProps {
    showText?: boolean;
}

const State = observer((props: Props) => {
    const { event, showText } = props;
    return (
        <div 
            style={{gridColumn: 'state'}} 
            className={clsx('state', styles.state, !showText && styles.flex, props.className, 'grid-isValid')}
        >
            <div className={clsx(showText && styles.flex)}>
                <Badge 
                    icon={EventStateButton[event.state]}
                    color={EventStateColor[event.state]}
                    size={SIZE_S}
                    title={EventStateTranslation[event.state]}
                    text={showText && EventStateTranslation[event.state]}
                    iconSide='left'
                />
            </div>
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