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
    const [inputValue, setInputValue] = React.useState('');
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
                inputValue={inputValue} /** used for the current typed input */
                onInputChange={(newValue) => {
                    const hasChunks = /(;|\s|\t|,\n)/.test(newValue);
                    if (!hasChunks) {
                        setInputValue(newValue);
                        return;
                    }
                    const splittedValues = newValue
                        .split(/\s*(;|\s|\t|,\n)+\s*/g)
                        .map((v) => v.trim())
                        .filter((v) => !!v);
                    const remainingInput: string[] = [];
                    const users = splittedValues
                        .map((val) => {
                            const user = userStore.matchByNameOrEmail(val);
                            if (!user) {
                                remainingInput.push(val);
                            }
                            return user;
                        })
                        .filter((u) => !!u);
                    if (users.length === 0) {
                        setInputValue(newValue);
                        return;
                    }
                    users.forEach((user) => {
                        event.addLinkedUserId(user!.id);
                    });
                    setInputValue(remainingInput.join(' '));
                }}
                onChange={(opt, meta) => {
                    switch (meta.action) {
                        case 'select-option':
                            event.addLinkedUserId(meta.option.value);
                            break;
                        case 'remove-value':
                            event.removeLinkedUserId(meta.removedValue.value);
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
