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
                <button
                    className={clsx(
                        POPUP_BUTTON_STYLE
                    )}
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <span className={clsx(styles.textAndIcon)}>
                        <span className={clsx(styles.text)}>
                            {props.event.groups.length}
                        </span>
                        <span className={clsx(styles.spacer, styles.borderLeft)}></span>
                        <Icon path={mdiTagEditOutline} size={SIZE_S} />
                    </span>
                </button>
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