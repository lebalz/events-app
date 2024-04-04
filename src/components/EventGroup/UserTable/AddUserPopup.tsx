import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { mdiCheckCircle, mdiPlusCircleOutline } from '@mdi/js';
import { Icon, SIZE_S } from '../../shared/icons';
import TextInput from '../../shared/TextInput';
import { translate } from '@docusaurus/Translate';
import Badge from '../../shared/Badge';
import EventGroup from '@site/src/models/EventGroup';
import _ from 'lodash';
import Popup from 'reactjs-popup';


interface Props {
    group: EventGroup;
}

const AddUserPopup = observer((props: Props) => {
    const [searchText, setSearchText] = React.useState('');
    const [_searchFilter, _setSearchFilter] = React.useState(new RegExp('', 'i'));
    const onSearchChanged = React.useMemo(() => {
        return _.throttle(_setSearchFilter, 500);
    }, [_setSearchFilter]);

    React.useEffect(() => {
        onSearchChanged(new RegExp(searchText, 'i'));
    }, [searchText, onSearchChanged]);

    const userStore = useStore('userStore');
    return (
        <Popup
            trigger={
                <span>
                    <Button icon={mdiPlusCircleOutline} size={SIZE_S} />
                </span>
            }
            modal
            position={['top center', 'bottom center', 'right center', 'left center', 'bottom right', 'top right', 'center center']}
            nested
        >
            <div className={clsx(styles.content)}>
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
                                        userStore.models.filter(u => u.matches(_searchFilter)),
                                        ['lastName'],
                                        ['asc']
                                    ).map((user) => {
                                        return (
                                            <tr key={user.id}>
                                                <td><Badge text={user.shortName || '-'} /></td>
                                                <td>{user.firstName}</td>
                                                <td>{user.lastName}</td>
                                                <td>
                                                    {
                                                        props.group.userIds.has(user.id) ? (
                                                            <Icon
                                                                path={mdiCheckCircle}
                                                                color='green'
                                                                size={SIZE_S}
                                                            />
                                                        ) : (
                                                            <Button
                                                                icon={mdiPlusCircleOutline}
                                                                size={SIZE_S}
                                                                color='green'
                                                                onClick={() => { props.group.addUsers([user]) }}
                                                            />
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Popup>
    )
});

export default AddUserPopup;