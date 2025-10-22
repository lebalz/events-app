import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select from 'react-select';
import Event from '@site/src/models/Event';
import _ from 'lodash';
import { translate } from '@docusaurus/Translate';

interface Props {
    event: Event;
}

const UserPicker = observer((props: Props) => {
    const userStore = useStore('userStore');
    const { event } = props;

    return (
        <div className={clsx(styles.UserPicker)}>
            <Select
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: '1000' }),
                    menu: (base) => ({ ...base, zIndex: 'calc(var(--ifm-z-index-dropdown) + 10)' }),
                    container: (base) => ({ ...base, minWidth: '15em' }),
                    multiValueLabel: (base) => ({
                        ...base,
                        paddingLeft: '3px'
                    })
                }}
                className={clsx(styles.select)}
                classNamePrefix="select"
                value={event.linkedUsers.map((user) => {
                    return {
                        value: user.id,
                        label: user.displayName
                    };
                })}
                placeholder={translate({
                    message: 'Lehrpersonen auswählen',
                    id: 'share.audiencePicker.placeholder.linkedUsers',
                    description: 'share.audiencePicker.placeholder.linkedUsers'
                })}
                options={_.orderBy(userStore.models.slice(), ['lastName', 'firstName'], ['asc', 'asc']).map(
                    (t) => ({
                        value: t.id,
                        label: `${t.displayName} - ${t.fullName}`
                    })
                )}
                noOptionsMessage={(val) => {
                    return translate(
                        {
                            message: 'Unbekannte Option: "{val}"',
                            id: 'share.audiencePicker.noOptions',
                            description: 'share.audiencePicker.noOptions'
                        },
                        { val: val.inputValue }
                    );
                }}
                onChange={(opt, meta) => {
                    switch (meta.action) {
                        case 'select-option':
                            event.addLinkedUserId(meta.option.value);
                            break;
                        case 'remove-value':
                            event.removeLinkedUserId(meta.option.value);
                            break;
                        case 'clear':
                            event.clearLinkedUserIds();
                            break;
                    }
                }}
                isMulti
                isSearchable
                isClearable
            />
        </div>
    );
});

export default UserPicker;
