import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import {default as UserModel} from '@site/src/models/User';
import { formatDateTime } from '@site/src/models/helpers/time';
import Badge from '../../shared/Badge';
import { Role } from '@site/src/api/user';
import Button from '../../shared/Button';
import UntisLinker from '../../User/UntisLinker';
import { ApiState } from '@site/src/stores/iStore';


interface Props {
    user: UserModel;
}

const UserTable = observer((props: Props) => {
    const userStore = useStore('userStore');
    const {user} = props;
    return (
        <tr className={clsx(styles.user)}>
            <td>{user.email}</td>
            <td>
                <div className={clsx(styles.role)}>
                    { 
                        Object.keys(Role).map((key, idx) => {
                            return (<Button 
                                text={Role[key]}
                                disabled={userStore.apiStateFor(`save-role-${user.id}`) === ApiState.LOADING}
                                active={user.role === Role[key]}
                                color={user.role === Role[key] ? 'primary' : 'secondary'}
                                onClick={() => userStore.setRole(user, Role[key])}
                                key={idx} 
                            />);
                        })
                    }
                </div>
            </td>
            <td><UntisLinker user={user} /></td>
            <td>{formatDateTime(user.createdAt)}</td>
            <td>{formatDateTime(user.updatedAt)}</td>
            <td><Badge text={user.id} /></td>
        </tr>
    )
});

export default UserTable;