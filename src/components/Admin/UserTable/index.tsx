import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as UserModel} from '@site/src/models/User';
import User from './User';
import Button from '../../shared/Button';
import { mdiSortAscending, mdiSortDescending } from '@mdi/js';
import { SIZE_S } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import TextInput from '../../shared/TextInput';
import Badge from '../../shared/Badge';


interface Props {
    users: UserModel[];
}

const UserTable = observer((props: Props) => {
    const [itemsShown, setItemsShown] = React.useState(15);
    const {adminUserTable} = useStore('viewStore');
    const observerTarget = React.useRef(null);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
            if (entries[0].isIntersecting) {
                if (itemsShown < props.users.length) {
                    setItemsShown((prev) => prev + 20);
                }
            }
            },
            { threshold: 1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, props.users.length]);

    const {users} = props;
    const icon = adminUserTable.sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending;
    return (
        <div>
            <div className={clsx('alert alert--primary', styles.filter)} role='alert'>
                <TextInput
                    placeholder={translate({
                        message: "Filter",
                        id: 'admin.userTable.filter.placeholder',
                        description: 'filter: placeholder'
                    })}
                    onChange={(txt) => adminUserTable?.setTextFilter(txt)} 
                    text={adminUserTable?._filter}
                    search
                />
                <Badge 
                    color='primary'
                    text={`Users: ${users.length}`}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'email' && icon}
                                text={translate({
                                    message: "Email",
                                    id: 'admin.userTable.th.email',
                                    description: 'th: email'
                                })}
                                onClick={() => adminUserTable.setSortColumn('email')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'role' && icon}
                                text={translate({
                                    message: "Rolle",
                                    id: 'admin.userTable.th.role',
                                    description: 'th: role'
                                })}
                                onClick={() => adminUserTable.setSortColumn('role')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'shortName' && icon}
                                text={translate({
                                    message: "Kürzel",
                                    id: 'admin.userTable.th.shortName',
                                    description: 'th: shortName'
                                })}
                                onClick={() => adminUserTable.setSortColumn('shortName')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'createdAt' && icon}
                                text={translate({
                                    message: "Erstellt",
                                    id: 'admin.userTable.th.createdAt',
                                    description: 'th: createdAt'
                                })}
                                onClick={() => adminUserTable.setSortColumn('createdAt')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'updatedAt' && icon}
                                text={translate({
                                    message: "Aktualisiert",
                                    id: 'admin.userTable.th.updatedAt',
                                    description: 'th: updatedAt'
                                })}
                                onClick={() => adminUserTable.setSortColumn('updatedAt')} 
                            />
                        </th>
                        <th>
                            <Button 
                                size={SIZE_S}
                                iconSide='left'
                                icon={adminUserTable.sortColumn === 'id' && icon}
                                text={translate({
                                    message: "Id",
                                    id: 'admin.userTable.th.id',
                                    description: 'th: id'
                                })}
                                onClick={() => adminUserTable.setSortColumn('id')} 
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.slice(0, itemsShown).map((user, idx) => {
                            return <User key={user.id} user={user} />;
                        })
                    }
                </tbody>
            </table>
            <div ref={observerTarget}></div>
        </div>
    )
});

export default UserTable;