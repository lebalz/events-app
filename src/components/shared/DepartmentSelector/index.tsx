import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select from 'react-select';
import Event from '@site/src/models/Event';
import { action } from 'mobx';
import Department from '@site/src/models/Department';

interface Props {
    eventId: string;
}

const DepartmentLinker = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    const departmentStore = useStore('departmentStore');
    const event = eventStore.find<Event>(props.eventId);
    return (
        <div className={clsx(styles.container)}>
            <Select
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                className={clsx(styles.select)}
                classNamePrefix="select"
                value={event.departmentIds.map((id) => ({ label: departmentStore.find<Department>(id).name, value: id }))}
                options={
                    departmentStore.departments.slice().map((dep) => ({
                        value: dep.id,
                        label: `${dep.name}`
                    }))
                }
                onChange={action((opt) => {
                    if (opt) {
                        event.departmentIds.replace(opt.map((o) => o.value));
                    }
                })}
                isMulti={true}
                isSearchable={true}
                isClearable={true}
            />

        </div>
    )
});

export default DepartmentLinker;