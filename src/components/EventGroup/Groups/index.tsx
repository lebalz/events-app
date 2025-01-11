import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import AddButton from '../../Event/AddButton';
import { translate } from '@docusaurus/Translate';
import _ from 'lodash';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Collection from './Collection';
import { DEFAULT_COLLECTION } from '@site/src/api/event_group';
import Storage, { StorageKey } from '@site/src/stores/utils/Storage';

interface Props {}

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
                    const collection = Storage.get(StorageKey.EventGroupCollection, '', (str) => str);
                    eventGroupStore
                        .create({ event_ids: [], name: 'Neue Gruppe', collection: collection })
                        .then((group) => {
                            group.setEditing(true);
                        });
                }}
                apiState={eventGroupStore.apiStateFor('create')}
                className={clsx(styles.addGroup)}
            />
            {eventGroupStore.collections.length > 0 && (
                <Tabs
                    lazy
                    groupId={StorageKey.EventGroupCollection.replace('docusaurus.tab.', '')}
                    defaultValue={DEFAULT_COLLECTION}
                >
                    {eventGroupStore.collections.map((name, idx) => {
                        return (
                            <TabItem value={name || DEFAULT_COLLECTION} key={idx}>
                                <Collection
                                    name={name || DEFAULT_COLLECTION}
                                    groups={eventGroupStore.byCollection(name)}
                                    onChangeCollection={(name) => {
                                        Storage.set(
                                            StorageKey.EventGroupCollection,
                                            name,
                                            (val) => val || DEFAULT_COLLECTION
                                        );
                                    }}
                                />
                            </TabItem>
                        );
                    })}
                </Tabs>
            )}
        </div>
    );
});

export default Groups;
