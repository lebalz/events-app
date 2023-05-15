import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as UserModel} from '@site/src/models/User';
import Department from './Department';
import Button from '../../shared/Button';
import { mdiPlusCircleOutline, mdiSortAscending, mdiSortDescending } from '@mdi/js';
import { SIZE, SIZE_S } from '../../shared/icons';
import {default as DepartmentModel} from '@site/src/models/Department';


interface Props {
    departments: DepartmentModel[];
}

const DepartmentTable = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    const {adminDepartmentTable} = useStore('viewStore');
    const {departments} = props;
    const icon = adminDepartmentTable.sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending;
    return (
        <div>
            <Button
                text="Neue Abteilung"
                onClick={() => departmentStore.create({name: ' '})}
                iconSide='left'
                icon={mdiPlusCircleOutline}
                apiState={departmentStore.apiStateFor('create')}
            />
            <table>
                <thead>
                    <tr>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'name' && icon} text="Name" onClick={() => adminDepartmentTable.setSortColumn('name')} /></th>
                        <th>Beschreibung</th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'color' && icon} text="Farbe" onClick={() => adminDepartmentTable.setSortColumn('color')}/></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'createdAt' && icon} text="Erstellt" onClick={() => adminDepartmentTable.setSortColumn('createdAt')}/></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'updatedAt' && icon} text="Aktualisiert" onClick={() => adminDepartmentTable.setSortColumn('updatedAt')}/></th>
                        <th>Id</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        departments.map((dep, idx) => {
                            return <Department key={dep.id} department={dep} />;
                        })
                    }
                </tbody>
            </table>
        </div>
    )
});

export default DepartmentTable;