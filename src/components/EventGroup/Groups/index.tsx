import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import { DEFAULT_COLLECTION } from '@site/src/api/event_group';
import { useStore } from '@site/src/stores/hooks';
import Storage, { StorageKey } from '@site/src/stores/utils/Storage';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import { observer } from 'mobx-react-lite';
import AddButton from '../../Event/AddButton';
import Collection from './Collection';
import styles from './styles.module.scss';

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
                    const collection = Storage.get(StorageKey.EventGroupCollection, '');
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
                    className="full-width"
                >
                    {eventGroupStore.collections.map((name, idx) => {
                        return (
                            <TabItem value={name || DEFAULT_COLLECTION} key={idx}>
                                <Collection
                                    name={name || DEFAULT_COLLECTION}
                                    groups={eventGroupStore.byCollection(name)}
                                    onChangeCollection={(name) => {
                                        Storage.set(StorageKey.EventGroupCollection, name);
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
