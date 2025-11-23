import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Select, { ActionMeta, FilterOptionOption } from 'react-select';
import Event from '@site/src/models/Event';
import _ from 'lodash';
import { translate } from '@docusaurus/Translate';

interface BaseOption {
    label: string;
    value: string;
}

interface UserOption extends BaseOption {
    type: 'user';
}

interface GroupOption extends BaseOption {
    type: 'group';
    lang: 'de' | 'fr';
}

export type SelectOption = UserOption | GroupOption;

interface Props {
    event: Event;
}

const sanitized = (str: string) => {
    return str.replaceAll(/(\s|\d|;|:|\(|\)|@)/g, '');
};

const UserPicker = observer((props: Props) => {
    const [inputValue, setInputValue] = React.useState('');
    const userStore = useStore('userStore');
    const untisStore = useStore('untisStore');
    const viewStore = useStore('viewStore');
    const filter = React.useCallback((candidate: FilterOptionOption<SelectOption>, input: string) => {
        if (input) {
            return new RegExp(_.escapeRegExp(sanitized(input)), 'i').test(
                sanitized(`${candidate.label} ${candidate.value}`)
            );
        }
        return true;
    }, []);
    const { event } = props;

    return (
        <div className={clsx(styles.userPicker)}>
            <Select
                menuPortalTarget={document.body}
                filterOption={filter}
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
                        label: user.displayName,
                        type: 'user'
                    };
                })}
                placeholder={translate({
                    message: 'Lehrpersonen auswählen',
                    id: 'share.audiencePicker.placeholder.linkedUsers',
                    description: 'share.audiencePicker.placeholder.linkedUsers'
                })}
                options={viewStore.linkingUsersOptions}
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
                onChange={(opt, meta: ActionMeta<SelectOption>) => {
                    switch (meta.action) {
                        case 'select-option':
                            switch (meta.option.type) {
                                case 'user':
                                    event.addLinkedUserId(meta.option.value);
                                    break;
                                case 'group':
                                    const { lang, value } = meta.option;
                                    const teachersSubjects =
                                        untisStore.teachersSubjects.get(viewStore.semesterId || '') || [];

                                    const usersToAdd = teachersSubjects
                                        .filter(
                                            (ts) =>
                                                ts.lang === lang &&
                                                ts.subjects.map((s) => s.name).includes(value)
                                        )
                                        .map((ts) => ts.userId);
                                    usersToAdd.forEach((uId) => {
                                        event.addLinkedUserId(uId);
                                    });
                                    break;
                            }
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
