import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from '../../shared/Popup';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { mdiGroup } from '@mdi/js';
import { SIZE_S, SIZE_XS } from '../../shared/icons';
import GroupSelect from './GroupSelect';


interface Props {
    event: Event;
    trigger?: JSX.Element;
}

const EventsGroupPopup = observer((props: Props) => {
    return (
        <Popup
            trigger={props.trigger || <Button icon={mdiGroup} size={SIZE_XS} />}
            popupTitle='Event Group'
            on='click'
        >
            <GroupSelect event={props.event} />
        </Popup>
    )
});

export default EventsGroupPopup;