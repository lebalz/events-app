import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as DepartmentModel} from '@site/src/models/Department';
import { formatDateTime } from '@site/src/models/helpers/time';
import Badge from '../../shared/Badge';
import Save from '../../shared/Button/Save';
import Delete from '../../shared/Button/Delete';
import Discard from '../../shared/Button/Discard';
import TextArea from '../../shared/TextArea';
import TextInput from '../../shared/TextInput';


interface Props {
    department: DepartmentModel;
}

const Department = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    const {department} = props;
    return (
        <tr className={clsx(styles.department)}>
            <td>
                <TextInput text={department.name} onChange={(txt) => department.update({name: txt})} />
            </td>
            <td className={clsx(styles.description)}>
                <TextArea text={department.description} onChange={(txt) => department.update({description: txt})} rows={2}/>
            </td>
            <td className={clsx(styles.colorData)}>
                <label className={clsx(styles.color)}>
                    <Badge 
                        text={department.color} 
                        color={department.color}
                    />
                    <input 
                        type="color" 
                        value={department.color} 
                        onChange={(e) => department.update({color: e.target.value})} 
                    />
                </label>
            </td>
            <td>{formatDateTime(department.createdAt)}</td>
            <td>{formatDateTime(department.updatedAt)}</td>
            <td><Badge text={department.id} /></td>
            <td>
                <div className={clsx(styles.actions)}>
                    {department.isDirty && <Discard onClick={() => department.reset()} />}
                    {department.isDirty && <Save onClick={() => departmentStore.save(department)} />}
                    <Delete onClick={() => departmentStore.destroy(department)} disabled={department.events.length > 0 || department.classes.length > 0} />
                </div>
            </td>
        </tr>
    )
});

export default Department;