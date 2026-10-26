import clsx from 'clsx';
import React from 'react';

import { mdiAccountEdit, mdiCheckboxBlank, mdiCheckboxMarked, mdiCloudQuestion } from '@mdi/js';
import Icon from '@mdi/react';
import { AuthProviderColor, AuthProviderIcons, Role } from '@site/src/api/user';
import { formatDateTime } from '@site/src/models/helpers/time';
import { default as UserModel } from '@site/src/models/User';
import { useStore } from '@site/src/stores/hooks';
import { ApiState } from '@site/src/stores/iStore';
import { observer } from 'mobx-react-lite';
import Popup from 'reactjs-popup';
import { type PopupActions } from 'reactjs-popup/dist/types';
import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import { SIZE_S, SIZE_XS } from '../../shared/icons';
import UntisLinker from '../../User/UntisLinker';
import EditUser from '../EditUser';
import styles from './styles.module.scss';

interface Props {
    user: UserModel;
}

const UserTable = observer((props: Props) => {
    const userStore = useStore('userStore');
    const ref = React.useRef<PopupActions>(null);
    const { user } = props;
    return (
        <tr className={clsx(styles.user)}>
            <td>{user.email}</td>
            <td>
                <div className={clsx(styles.role)}>
                    {(Object.keys(Role) as (keyof typeof Role)[]).map((key, idx) => {
                        return (
                            <Button
                                text={Role[key]}
                                disabled={userStore.apiStateFor(`save-role-${user.id}`) === ApiState.LOADING}
                                active={user.role === Role[key]}
                                color={user.role === Role[key] ? 'primary' : 'secondary'}
                                onClick={() => userStore.setRole(user, Role[key])}
                                key={idx}
                            />
                        );
                    })}
                </div>
            </td>
            <td>
                <div className={clsx(styles.flex)}>
                    <Popup
                        trigger={
                            <span>
                                <Button icon={mdiAccountEdit} size={SIZE_S} color="orange" />
                            </span>
                        }
                        modal
                        nested
                        ref={ref}
                        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
                        on={'click'}
                    >
                        <EditUser user={user} close={() => ref.current?.close()} />
                    </Popup>
                </div>
            </td>
            <td>
                <Badge
                    icon={user.notifyOnEventUpdate ? mdiCheckboxMarked : mdiCheckboxBlank}
                    color={user.notifyOnEventUpdate ? 'green' : 'grey'}
                    size={SIZE_XS}
                />
            </td>
            <td>
                <UntisLinker user={user} />
            </td>
            <td>
                {user.authProviders.map((u, idx) => (
                    <Icon
                        path={AuthProviderIcons[u] || mdiCloudQuestion}
                        size={SIZE_XS}
                        color={AuthProviderColor[u]}
                        key={idx}
                        title={u}
                    />
                ))}
            </td>
            <td>{formatDateTime(user.createdAt)}</td>
            <td>{formatDateTime(user.updatedAt)}</td>
            <td>
                <Badge text={user.id} />
            </td>
        </tr>
    );
});

export default UserTable;
