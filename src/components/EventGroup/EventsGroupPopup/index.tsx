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
    const ref = React.useRef<HTMLDivElement>(null);
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        if (ref.current) {
            setShow(true);
        }
    },[ref]);

    return (
        <div ref={ref}>
            {
                show && (
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
                        parentRef={ref}
                    >
                        <GroupSelect event={props.event} />
                    </Popup>
                )
            }
        </div>
    )
});

export default EventsGroupPopup;