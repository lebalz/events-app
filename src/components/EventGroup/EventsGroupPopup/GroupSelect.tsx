import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select from 'react-select';
import Event from '@site/src/models/Event';
import EventGroup from '@site/src/models/EventGroup';


interface Props {
    event: Event;
}

const GroupSelect = observer((props: Props) => {
    const { event } = props;
    const eventGroupStore = useStore('eventGroupStore');
    return (
        <Select
            isMulti={true}
            isSearchable={true}
            isClearable={true}
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: '1000' })
            }}
            onChange={(options, meta) => {
                console.log('options', options, meta);
                switch (meta.action) {
                    case 'select-option':
                        const group = eventGroupStore.find<EventGroup>(meta.option.value);
                        if (group) {
                            group.addEvents([event]);
                        }
                        break;
                    case 'remove-value':
                        const rmGroup = eventGroupStore.find<EventGroup>(meta.removedValue?.value);
                        if (rmGroup) {
                            rmGroup.removeEvents([event]);
                        }
                        break;
                    case 'clear':
                        event.groups.forEach(g => g.removeEvents([event]));
                        break;	
                }
            }}
            options={
                eventGroupStore.eventGroups.map(group => ({
                    value: group.id,
                    label: group.name,
                }))
            }
            value={
                event.groups.map(g => ({ value: g.id, label: g.name }))
            }
        />
    )
});

export default GroupSelect;