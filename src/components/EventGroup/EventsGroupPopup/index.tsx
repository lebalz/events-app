import React from 'react';

import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';
import Button from '../../shared/Button';
import { mdiTagEditOutline } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import GroupSelect from './GroupSelect';
import Popup from 'reactjs-popup';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';


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
                        title={
                            props.event.groups.length > 0
                                ? props.event.groups.map((g) => g.name).join(', ')
                                : translate({message: 'Gruppen hinzufügen', id: 'event.group.add'})
                        }
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