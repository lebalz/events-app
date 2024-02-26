import React from 'react';

import { observer } from 'mobx-react-lite';
import Popup from '../../shared/Popup';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { mdiTagEditOutline } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import GroupSelect from './GroupSelect';


interface Props {
    event: Event;
    trigger?: JSX.Element;
}

const EventsGroupPopup = observer((props: Props) => {
    return (
        <Popup
            trigger={props.trigger ||( 
                <Button 
                    text={`${props.event.groups.length}`}
                    icon={mdiTagEditOutline} 
                    size={SIZE_S}
                />
            )}
            popupTitle='Event Group'
            on='click'
        >
            <GroupSelect event={props.event} />
        </Popup>
    )
});

export default EventsGroupPopup;