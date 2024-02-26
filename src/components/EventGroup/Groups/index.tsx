import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import AddButton from '../../Event/AddButton';
import { translate } from '@docusaurus/Translate';
import UserEventGroup from '..';


interface Props {
}

const Groups = observer((props: Props) => {
    const eventGroupStore = useStore('eventGroupStore');
    return (
        <div>
            <AddButton
                text={translate({
                    message: 'Gruppe hinzufügen',
                    id: 'user.button.add-group'
                })}
                onAdd={() => {
                    eventGroupStore.create({ event_ids: [], name: 'Neue Gruppe' }).then((group) => {
                        group.setEditing(true);
                    });
                }}
                apiState={eventGroupStore.apiStateFor('create')}
            />
            <div className={clsx(styles.groups)}>
                {
                    eventGroupStore.eventGroups.map((group) => {
                        return (
                            <UserEventGroup group={group} key={group.id} />
                        );
                    })
                }
            </div>
        </div>
    )
});

export default Groups;