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
import { translate } from '@docusaurus/Translate';


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
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'email' && icon}
                                text={translate({message: "Email", id: 'admin.userTable.th.email', description: 'th: email'})}
                                onClick={() => adminUserTable.setSortColumn('email')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'role' && icon}
                                text={translate({message: "Rolle", id: 'admin.userTable.th.role', description: 'th: role'})}
                                onClick={() => adminUserTable.setSortColumn('role')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'shortName' && icon}
                                text={translate({message: "Kürzel", id: 'admin.userTable.th.shortName', description: 'th: shortName'})}
                                onClick={() => adminUserTable.setSortColumn('shortName')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'createdAt' && icon}
                                text={translate({message: "Erstellt", id: 'admin.userTable.th.createdAt', description: 'th: createdAt'})}
                                onClick={() => adminUserTable.setSortColumn('createdAt')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'updatedAt' && icon}
                                text={translate({message: "Aktualisiert", id: 'admin.userTable.th.updatedAt', description: 'th: updatedAt'})}
                                onClick={() => adminUserTable.setSortColumn('updatedAt')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'id' && icon}
                                text={translate({message: "Id", id: 'admin.userTable.th.id', description: 'th: id'})}
                                onClick={() => adminUserTable.setSortColumn('id')} 
                            />
                        </th>
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