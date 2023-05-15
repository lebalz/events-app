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
import Translate, { translate } from '@docusaurus/Translate';


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
                text={translate({message: 'Neue Abteilung', description: 'Create a new department', id: 'admin.DepartmentTable.create'})}
                onClick={() => departmentStore.create({name: ' '})}
                iconSide='left'
                icon={mdiPlusCircleOutline}
                apiState={departmentStore.apiStateFor('create')}
            />
            <table>
                <thead>
                    <tr>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'name' && icon} text={translate({message: 'Name', description: 'th: name', id: 'admin.DepartmentTable.th.name'})} onClick={() => adminDepartmentTable.setSortColumn('name')} /></th>
                        <th><Translate id="admin.DepartmentTable.th.description" description='th: description'>Beschreibung</Translate></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'color' && icon} text={translate({message: 'Farbe', description: 'th: color', id: 'admin.DepartmentTable.th.color'})} onClick={() => adminDepartmentTable.setSortColumn('color')}/></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'createdAt' && icon} text={translate({message: 'Erstellt', description: 'th: created At', id: 'admin.DepartmentTable.th.createdAt'})} onClick={() => adminDepartmentTable.setSortColumn('createdAt')}/></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminDepartmentTable.sortColumn === 'updatedAt' && icon} text={translate({message: 'Aktualisiert', description: 'th: updatedAt', id: 'admin.DepartmentTable.th.updatedAt'})} onClick={() => adminDepartmentTable.setSortColumn('updatedAt')}/></th>
                        <th><Translate id="admin.DepartmentTable.th.id" description='th: id'>Id</Translate></th>
                        <th><Translate id="admin.DepartmentTable.th.actions" description='th: actions'>Aktionen</Translate></th>
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