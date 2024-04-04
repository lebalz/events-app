import React from 'react';

import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';
import Button, { POPUP_BUTTON_STYLE } from '../../shared/Button';
import { mdiTagEditOutline } from '@mdi/js';
import { Icon, SIZE_S } from '../../shared/icons';
import GroupSelect from './GroupSelect';
import Popup from 'reactjs-popup';
import clsx from 'clsx';
import { getButtonColorClass } from '../../shared/Colors';
import styles from './styles.module.scss';


interface Props {
    event: Event;
}

const EventsGroupPopup = observer((props: Props) => {
    return (
        <Popup
            trigger={
                <span>
                    <Button
                        icon={mdiTagEditOutline}
                        size={SIZE_S}
                        title='Gruppen'
                        color={'primary'}
                        text={`${props.event.groups.length}`}
                        onClick={(e) => e.preventDefault()}
                    />
                </span>
            }
            on='click'
            position={['bottom right', 'top right']}
            nested
        >
            <div className={clsx('card')}>
                <div className={clsx('card__header')}>
                    <h4>
                        Gruppen
                    </h4>
                </div>    
                <div className={clsx('card__body')}>
                    <GroupSelect event={props.event} />
                </div>
            </div>
        </Popup>
    )
});

export default EventsGroupPopup;