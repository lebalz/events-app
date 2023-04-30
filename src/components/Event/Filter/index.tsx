import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Badge from '../../shared/Badge';
import Delete from '../../shared/Button/Delete';
import { action } from 'mobx';
import { EventState } from '@site/src/api/event';
import Button from '../../shared/Button';
import { mdiBookCancel, mdiBookmarkCheck, mdiBookmarkMinus, mdiFileCertificate } from '@mdi/js';
import { Icon } from '../../shared/icons';
import { Role } from '@site/src/api/user';
import TextInput from '../../shared/TextInput';

interface Props {
}

const Filter = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const {eventTable} = viewStore;
    return (
        <div className={clsx(styles.filter)}>
            <div className={clsx(styles.department)}>
                {departmentStore.departments.map((department) => (
                    <Button 
                        text={department.name}
                        className={clsx(eventTable.departmentIds.has(department.id) && styles.selected)}
                        onClick={() => eventTable.toggleDepartment(department.id)} 
                        key={department.id}
                    />
                ))}
            </div>
            <div className={clsx(styles.classes)}>
                <TextInput onChange={(txt) => eventTable.setClassFilter(txt)} text={eventTable.klassFilter}/>
            </div>
        </div>
    )
});

export default Filter;