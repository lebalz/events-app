import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import EventGroup from '@site/src/models/EventGroup';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { DEFAULT_COLLECTION } from '@site/src/api/event_group';
import CreatableSelect from 'react-select/creatable';

interface Props {
    group: EventGroup;
    onSelect: (name: string) => void;
}

const Selector = observer((props: Props) => {
    const eventGroupStore = useStore('eventGroupStore');
    const { group } = props;
    return (
        <div>
            <CreatableSelect
                isClearable={false}
                isSearchable
                closeMenuOnSelect
                formatCreateLabel={(inputValue) => {
                    return translate(
                        {
                            id: 'group.collection.new',
                            message: 'Neue Sammlung: {inputValue}'
                        },
                        { inputValue }
                    );
                }}
                name="group.collection"
                menuPortalTarget={document.body}
                options={eventGroupStore.collections.map((c) => ({
                    label: c || DEFAULT_COLLECTION,
                    value: c
                }))}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 'var(--ifm-z-index-overlay)' }),
                    container: (base) => ({ ...base, minWidth: '15em' })
                }}
                className={clsx(styles.select)}
                onChange={(option, meta) => {
                    switch (meta.action) {
                        case 'create-option':
                        case 'select-option':
                            if (!option) {
                                return;
                            }
                            if (option.value === DEFAULT_COLLECTION) {
                                props.onSelect('');
                            } else {
                                props.onSelect(option.value);
                            }
                            break;
                        case 'clear':
                        case 'remove-value':
                            props.onSelect('');
                            break;
                    }
                }}
                onCreateOption={(option) => {
                    if (option === DEFAULT_COLLECTION) {
                        props.onSelect('');
                    } else {
                        props.onSelect(option);
                    }
                }}
                value={{ label: group.collection, value: group.collection }}
            />
        </div>
    );
});

export default Selector;
