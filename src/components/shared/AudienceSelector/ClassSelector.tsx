import React, { KeyboardEventHandler } from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, type MultiValueGenericProps, OptionProps, components } from 'react-select';
import { KlassName } from '@site/src/models/helpers/klassNames';
import Translate, { translate } from '@docusaurus/Translate';
import Tooltip from '../Tooltip';
import Department from '@site/src/models/Department';
import Klass from '@site/src/models/Untis/Klass';
import Icon from '@mdi/react';
import {
    mdiAccountMultiple,
    mdiAccountMultipleOutline,
    mdiAccountOutline,
    mdiAccountTagOutline,
    mdiGoogleClassroom,
    mdiOfficeBuilding
} from '@mdi/js';

const createOption = (label: string) => ({
    label,
    value: label
});

interface Props {
    event: EventModel;
}

interface BaseOption {
    label: string;
    value: string;
}

export interface DepartmentOption extends BaseOption {
    type: 'departmentType';
    model: Department;
}

export interface ClassOption extends BaseOption {
    type: 'classType';
    model: Klass;
}

export interface ClassGroupOption extends BaseOption {
    type: 'classGroup';
}

export type Option = DepartmentOption | ClassOption | ClassGroupOption;

const I18n_LABELS = {
    classType: translate({ id: 'basic.class', message: 'Klasse' }),
    departmentType: translate({ id: 'basic.department', message: 'Abteilung' }),
    levelType: translate({ id: 'basic.level', message: 'Stufe' })
};

const IconMap = {
    departmentType: mdiOfficeBuilding,
    classType: mdiGoogleClassroom,
    classGroup: mdiAccountMultiple
};

const MultiValueLabel = (props: MultiValueGenericProps<Option>) => {
    return (
        <div className={clsx(styles.multiValue)}>
            <div className={clsx(styles.icon, styles[props.data.type])}>
                <Icon path={IconMap[props.data.type]} size={0.6} />
            </div>
            <components.MultiValueLabel {...props} />
        </div>
    );
};

const OptionComponent = (props: OptionProps<Option>) => {
    return (
        <div className={clsx(styles.multiValue)}>
            <div className={clsx(styles.icon, styles[props.data.type])}>
                <Icon path={IconMap[props.data.type]} size={0.6} />
            </div>
            <components.Option {...props} />
        </div>
    );
};

const ClassSelector = observer((props: Props) => {
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const untisStore = useStore('untisStore');
    const { event } = props;

    const handleToken = (_token: string, action: 'add' | 'remove') => {
        const token = (_token || '').replace(/\*$/, '');
        if (token.length === 3) {
            const isValid = departmentStore.isValidClassGroup(token);
            if (isValid) {
                props.event.setClassGroup(token, action === 'add');
                setErrorMessages([]);
                return true;
            }
            setErrorMessages([
                translate(
                    {
                        message: `Abteilung "{letter}" nicht gefunden`,
                        id: 'share.audiencePicker.classSelector.errorMsg.department',
                        description: 'Error message department not found'
                    },
                    { letter: token.charAt(2) }
                )
            ]);
        } else if (token.length === 4) {
            const isValid = departmentStore.isValidClass(token);
            if (isValid) {
                props.event.setClass(token as KlassName, action === 'add');
                setErrorMessages([]);
                return true;
            }
            setErrorMessages([
                translate(
                    {
                        message: `Klasse "{tok}" nicht gefunden`,
                        id: 'share.audiencePicker.classSelector.errorMsg.class',
                        description: 'Error message class not found'
                    },
                    { tok: token }
                )
            ]);
        } else {
            setErrorMessages([
                translate(
                    {
                        message: `Unbekannte Abteilung/Klasse "{tok}"`,
                        id: 'share.audiencePicker.classSelector.errorMsg.classOrDepartment',
                        description: 'Error message class or department not found'
                    },
                    { tok: token }
                )
            ]);
        }
        return false;
    };

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (!inputValue) {
            return;
        }
        switch (event.key) {
            case 'Space':
            case 'Enter':
            case 'Tab':
                const added = handleToken(inputValue, 'add');
                if (added) {
                    setInputValue('');
                }
                event.preventDefault();
                break;
        }
    };

    const selected = React.useMemo<Option[]>(() => {
        return [
            ...event.departments.map((d) => {
                return {
                    label: d.shortName,
                    value: d.id,
                    type: 'departmentType',
                    model: d
                } as DepartmentOption;
            }),
            ...[...event.classes].map((c) => {
                console.log('class', c);
                return {
                    label: c,
                    value: c,
                    type: 'classType',
                    model: untisStore.classes.find((klass) => klass.name === c)
                } as ClassOption;
            }),
            ...[...event.classGroups].map((c) => {
                return {
                    label: `${c}*`,
                    value: c,
                    type: 'classGroup'
                } as ClassGroupOption;
            })
        ];
    }, [event.departments, [...event.classes].join(','), [...event.classGroups].join(',')]);

    return (
        <div>
            <CreatableSelect
                components={{
                    DropdownIndicator: null,
                    MultiValueLabel: MultiValueLabel,
                    Option: OptionComponent
                }}
                menuPortalTarget={document.body}
                inputValue={inputValue} /** used for the current typed input */
                isClearable
                isMulti
                onChange={(newValue, meta: ActionMeta<Option>) => {
                    console.log(meta.action, newValue, meta);
                    /** triggered, when values are removed */
                    switch (meta.action) {
                        case 'remove-value':
                        case 'pop-value':
                            switch (meta.removedValue.type) {
                                case 'departmentType':
                                    event.setDepartment(meta.removedValue.model, false);
                                    break;
                                case 'classType':
                                    event.setClass(meta.removedValue.value as KlassName, false);
                                    break;
                                case 'classGroup':
                                    event.setClassGroup(meta.removedValue.value, false);
                                    break;
                            }
                            break;
                        case 'clear':
                            meta.removedValues.forEach((v) => {
                                const toRemove = v.value;
                                if (toRemove.length === 3) {
                                    event.setClassGroup(toRemove, false);
                                } else if (toRemove.length === 4) {
                                    event.setClass(toRemove as KlassName, false);
                                }
                            });
                            break;
                        case 'select-option':
                            switch (meta.option.type) {
                                case 'departmentType':
                                    event.setDepartment(meta.option.model, true);
                                    break;
                                case 'classType':
                                    event.setClass(meta.option.value as KlassName, true);
                                    break;
                                case 'classGroup':
                                    event.setClassGroup(meta.option.value, true);
                                    break;
                            }
                            handleToken(meta.option.value, 'add');
                            break;
                        case 'deselect-option':
                            switch (meta.option.type) {
                                case 'departmentType':
                                    event.setDepartment(meta.option.model, false);
                                    break;
                                case 'classType':
                                    event.setClass(meta.option.value as KlassName, false);
                                    break;
                                case 'classGroup':
                                    event.setClassGroup(meta.option.value, false);
                                    break;
                            }
                            break;
                        case 'create-option':
                            if (
                                meta.option.value.length === 3 ||
                                (meta.option.value.length === 4 && meta.option.value.endsWith('*'))
                            ) {
                                event.setClassGroup(meta.option.value.replace(/\*$/, ''), true);
                            } else if (meta.option.value.length === 4) {
                                event.setClass(meta.option.value as KlassName, true);
                            }
                            handleToken(meta.option.value, 'add');
                            break;
                    }
                }}
                onInputChange={(newValue) => {
                    setInputValue(newValue);
                }}
                styles={{
                    menu: (base) => ({ ...base, zIndex: 'calc(var(--ifm-z-index-dropdown) + 10)' }),
                    container: (base) => ({ ...base, minWidth: '15em' }),
                    multiValueLabel: (base) => ({
                        ...base,
                        paddingLeft: '3px'
                    })
                }}
                onKeyDown={handleKeyDown}
                placeholder={translate({
                    message: 'Unbekannte Klassen',
                    id: 'share.audiencePicker.placeholder.unknownClasses',
                    description: 'share.audiencePicker.placeholder.unknownClasses'
                })}
                options={viewStore.audienceOptions}
                isSearchable
                value={selected}
            />
            {errorMessages.map((errorMessage, idx) => (
                <div key={idx} style={{ color: 'red' }}>
                    {errorMessage}
                </div>
            ))}
        </div>
    );
});

export default ClassSelector;
