import React, { KeyboardEventHandler } from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, type MultiValueGenericProps, OptionProps, components } from 'react-select';
import { KlassName } from '@site/src/models/helpers/klassNames';
import { translate } from '@docusaurus/Translate';
import Department from '@site/src/models/Department';
import Klass from '@site/src/models/Untis/Klass';
import Icon from '@mdi/react';
import { mdiAccountMultiple, mdiAccountQuestion, mdiGoogleClassroom, mdiOfficeBuilding } from '@mdi/js';

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
    model: Department | undefined;
}

export type Option = DepartmentOption | ClassOption | ClassGroupOption;

const IconMap = {
    departmentType: mdiOfficeBuilding,
    classGroup: mdiAccountMultiple,
    classType: mdiGoogleClassroom,
    unknwon: mdiAccountQuestion
};

const MultiValueLabel = (props: MultiValueGenericProps<Option>) => {
    const valType = !!props.data.model ? props.data.type : 'unknwon';
    return (
        <div className={clsx(styles.multiValue)}>
            <div className={clsx(styles.icon, styles[valType])}>
                <Icon path={IconMap[valType]} size={0.6} />
            </div>
            <components.MultiValueLabel {...props} />
        </div>
    );
};

const OptionComponent = (props: OptionProps<Option>) => {
    const valType = !!props.data.model ? props.data.type : 'unknwon';

    return (
        <div className={clsx(styles.multiValue)}>
            <div className={clsx(styles.icon, styles[valType])}>
                <Icon path={IconMap[valType]} size={0.6} />
            </div>
            <components.Option {...props} />
        </div>
    );
};

const AudienceDropdownSelector = observer((props: Props) => {
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const untisStore = useStore('untisStore');
    const { event } = props;

    const isValidNewOption = React.useCallback(
        (_token: string) => {
            const token = (_token || '').replace(/\*$/, '');
            if (token.length < 3 || token.length > 4) {
                return false;
            }
            if (token.length === 3) {
                return departmentStore.isValidClassGroup(token);
            } else if (token.length === 4) {
                return departmentStore.isValidClass(token, true);
            }
            return false;
        },
        [departmentStore, event]
    );

    const handleToken = React.useCallback(
        (_token: string, action: 'add' | 'remove') => {
            const isValid = isValidNewOption(_token);
            const token = (_token || '').replace(/\*$/, '');
            if (token.length === 3) {
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
                if (isValid) {
                    // check for display-letters
                    const name = token as KlassName;
                    const dLetter = name.charAt(2);
                    const cLetter = name.charAt(3);
                    const dep = departmentStore.departments.find(
                        (d) =>
                            (d.letter === dLetter || d._displayLetter === dLetter) &&
                            d.classLetters.has(cLetter)
                    );
                    if (!dep) {
                        window.alert(
                            translate(
                                {
                                    message: 'Fehler beim Erzeugen der Klasse {name}',
                                    id: 'audiencePicker.onCreate.error.message'
                                },
                                { name: name }
                            )
                        );
                        return false;
                    }
                    const cleaned = name.replace(dep.displayLetter, dep.letter);
                    props.event.setClass(cleaned as KlassName, action === 'add');
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
            } else if (token.length === 36) {
                // it is a uuid
                return true;
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
        },
        [departmentStore, isValidNewOption, props.event]
    );

    const handleKeyDown: KeyboardEventHandler = React.useCallback(
        (event) => {
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
        },
        [handleToken, inputValue]
    );

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
                const kl = untisStore.classes.find((klass) => klass.name === c);
                let displayName = kl?.displayName ?? c;
                if (!kl) {
                    const dLetter = c.charAt(2);
                    const cLetter = c.charAt(3);
                    const dep = departmentStore.departments.find(
                        (d) =>
                            (d.letter === dLetter || d._displayLetter === dLetter) &&
                            d.classLetters.has(cLetter)
                    );
                    if (dep) {
                        displayName = c.replace(dep.letter, dep.displayLetter);
                    }
                }

                return {
                    label: displayName,
                    value: c,
                    type: 'classType',
                    model: kl
                } as ClassOption;
            }),
            ...[...event.classGroups].map((c) => {
                const dep = departmentStore.findByClassGroupName(c);
                return {
                    label: `${c}*`,
                    value: c,
                    type: 'classGroup',
                    model: dep
                } as ClassGroupOption;
            })
        ];
    }, [event.departments, departmentStore, [...event.classes].join(','), [...event.classGroups].join(',')]);

    if (viewStore.audienceOptions.length === 0) {
        return null;
    }

    return (
        <div>
            <CreatableSelect
                components={{
                    DropdownIndicator: null,
                    MultiValueLabel: MultiValueLabel,
                    Option: OptionComponent
                }}
                inputValue={inputValue} /** used for the current typed input */
                isClearable
                isMulti
                openMenuOnClick
                openMenuOnFocus
                onChange={(newValue, meta: ActionMeta<Option>) => {
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
                                switch (v.type) {
                                    case 'classType':
                                        event.setClass(v.value as KlassName, false);
                                        break;
                                    case 'classGroup':
                                        event.setClassGroup(v.value, false);
                                        break;
                                    case 'departmentType':
                                        event.setDepartmentId(v.value, false);
                                        break;
                                }
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
                            handleToken(meta.option.value, 'add');
                            break;
                    }
                }}
                onInputChange={(newValue) => {
                    setInputValue(newValue);
                }}
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
                onKeyDown={handleKeyDown}
                placeholder={translate({
                    message: 'Klassen oder Abteilungen auswählen',
                    id: 'share.audiencePicker.placeholder.unknownClasses',
                    description: 'share.audiencePicker.placeholder.unknownClasses'
                })}
                formatCreateLabel={(inputValue) => {
                    return translate(
                        {
                            message: 'Künftige Klasse erstellen: {inputValue}',
                            id: 'share.audiencePicker.createLabel',
                            description: 'share.audiencePicker.createLabel'
                        },
                        { inputValue: inputValue }
                    );
                }}
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
                isValidNewOption={isValidNewOption}
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

export default AudienceDropdownSelector;
