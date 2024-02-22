import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import EventGroup from '@site/src/models/EventGroup';
import { mdiPlusCircleOutline, mdiSortAscending, mdiSortDescending } from '@mdi/js';
import Button from '../../shared/Button';
import { DeleteIcon, SIZE_S } from '../../shared/icons';
import { translate } from '@docusaurus/Translate';
import _ from 'lodash';
import Badge from '../../shared/Badge';
import Popup from '../../shared/Popup';
import TextInput from '../../shared/TextInput';
import { useStore } from '@site/src/stores/hooks';


interface Props {
    group: EventGroup;
}

interface HeadProps {
    sortColumn: 'shortName' | 'firstName' | 'lastName';
    sortDirection: 'asc' | 'desc';
    onColumnHeaderClick?: (column: 'shortName' | 'firstName' | 'lastName') => void;
}

const UserTableHeadRow = (props: HeadProps) => {
    const icon = props.sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending;
    return (
        <tr>
            <th>
                <Button
                    size={SIZE_S}
                    iconSide='left'
                    icon={props.sortColumn === 'shortName' && icon}
                    text={translate({
                        message: "Kürzel",
                        id: 'eventGroup.userTable.th.shortName',
                        description: 'th: shortName'
                    })}
                    onClick={() => props.onColumnHeaderClick && props.onColumnHeaderClick('shortName')}
                />
            </th>
            <th>
                <Button
                    size={SIZE_S}
                    iconSide='left'
                    icon={props.sortColumn === 'firstName' && icon}
                    text={translate({
                        message: "Vorname",
                        id: 'eventGroup.userTable.th.firstName',
                        description: 'th: firstName'
                    })}
                    onClick={() => props.onColumnHeaderClick && props.onColumnHeaderClick('firstName')}
                />
            </th>
            <th>
                <Button
                    size={SIZE_S}
                    iconSide='left'
                    icon={props.sortColumn === 'lastName' && icon}
                    text={translate({
                        message: "Nachname",
                        id: 'eventGroup.userTable.th.lastName',
                        description: 'th: lastName'
                    })}
                    onClick={() => props.onColumnHeaderClick && props.onColumnHeaderClick('lastName')}
                />
            </th>
        </tr>)
}

const UserTable = observer((props: Props) => {
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [sortColumn, setSortColumn] = React.useState<'shortName' | 'firstName' | 'lastName'>('shortName');
    const [searchText, setSearchText] = React.useState('');

    const onColumnHeaderClick = (column: 'shortName' | 'firstName' | 'lastName') => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
        }
    }

    const userStore = useStore('userStore');


    return (
        <div>
            <Popup
                trigger={<Button icon={mdiPlusCircleOutline} size={SIZE_S} />}
                align='center'
                positions={['top']}
                classNameTrigger={styles.trigger}
                classNamePopup={styles.popup}
            >
                <div className={clsx(styles.addContainer)}>
                    <TextInput
                        text={searchText}
                        onChange={setSearchText}
                        autoFocus
                        placeholder={translate({
                            message: 'Suche',
                            id: 'eventGroup.userTable.search',
                            description: 'search'
                        })}
                        search
                    />
                    <div className={clsx(styles.addUsersWrapper)}>
                        <table className={clsx(styles.userTable)}>
                            <tbody>
                            {
                                _.orderBy(
                                    userStore.models.filter(u => u.firstName.includes(searchText) || u.lastName.includes(searchText) || u.shortName?.includes(searchText)), 
                                    ['lastName'], 
                                    ['asc']
                                ).map((user) => {
                                    return (
                                        <tr>
                                            <td><Badge text={user.shortName || '-'} /></td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>
                                                <Button
                                                    icon={mdiPlusCircleOutline}
                                                    size={SIZE_S}
                                                    color='green'
                                                    onClick={() => { props.group.addUsers([user]) }}
                                                />
                                            </td>
                                        </tr>
                                    )

                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Popup>
                
            <table className={clsx(styles.userTable)}>
                <thead>
                    <UserTableHeadRow
                        onColumnHeaderClick={onColumnHeaderClick}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection} 
                    />
                </thead>
                <tbody>
                    {
                        _.orderBy(props.group.users, [sortColumn], [sortDirection]).map((member) => {
                            return (
                                <tr>
                                    <td><Badge text={member.shortName || '-'} /></td>
                                    <td>{member.firstName}</td>
                                    <td>{member.lastName}</td>
                                    <td>
                                        {userStore.current.id !== member.id && (
                                            <Button
                                                icon={<DeleteIcon size={SIZE_S} />}
                                                color='red'
                                                onClick={() => { props.group.removeUsers([member]) }}
                                            />
                                        )}
                                    </td>
                                </tr>
                            )

                        })
                    }
                </tbody>
            </table>
        </div>
    )
});

export default UserTable;