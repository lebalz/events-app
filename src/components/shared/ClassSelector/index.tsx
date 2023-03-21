import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select from 'react-select';
import Event from '@site/src/models/Event';
import { action } from 'mobx';

interface Props {
    eventId: string;
}

const ClassLinker = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    const untisStore = useStore('untisStore');
    const event = eventStore.find<Event>(props.eventId);
    return (
        <div className={clsx(styles.container)}>
            <Select
                menuPortalTarget={document.body}
                styles={{ 
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    valueContainer: (base) => ({...base, flexBasis: '12em'}) 
                }}
                className={clsx(styles.select)}
                classNamePrefix="select"
                value={event.classes.map((cls) => ({ label: cls, value: untisStore.findClassByName(cls)?.id || '-' }))}
                options={
                    untisStore.sortedClasses.slice().map((cls) => ({
                        value: cls.id,
                        label: `${cls.name}`
                    }))
                }
                onChange={action((opt) => {
                    if (opt) {
                        event.classes.replace(opt.map((o) => o.label));
                    }
                })}
                isMulti={true}
                isSearchable={true}
                isClearable={true}
            />

        </div>
    )
});

export default ClassLinker;