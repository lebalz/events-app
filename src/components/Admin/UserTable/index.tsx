import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as UserModel} from '@site/src/models/User';
import User from './User';
import Button from '../../shared/Button';
import { mdiSortAscending, mdiSortDescending } from '@mdi/js';
import { SIZE, SIZE_S } from '../../shared/icons';


interface Props {
    users: UserModel[];
}

const UserTable = observer((props: Props) => {
    const {adminUserTable} = useStore('viewStore');
    const {users} = props;
    const icon = adminUserTable.sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending;
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminUserTable.sortColumn === 'email' && icon} text="Email" onClick={() => adminUserTable.setSortColumn('email')} /></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminUserTable.sortColumn === 'role' && icon} text="Role" onClick={() => adminUserTable.setSortColumn('role')} /></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminUserTable.sortColumn === 'shortName' && icon} text="Untis" onClick={() => adminUserTable.setSortColumn('shortName')} /></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminUserTable.sortColumn === 'createdAt' && icon} text="Created" onClick={() => adminUserTable.setSortColumn('createdAt')} /></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminUserTable.sortColumn === 'updatedAt' && icon} text="Updated" onClick={() => adminUserTable.setSortColumn('updatedAt')} /></th>
                        <th><Button size={SIZE_S} iconSide='left' icon={adminUserTable.sortColumn === 'id' && icon} text="Id" onClick={() => adminUserTable.setSortColumn('id')} /></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, idx) => {
                            return <User key={user.id} user={user} />;
                        })
                    }
                </tbody>
            </table>
        </div>
    )
});

export default UserTable;