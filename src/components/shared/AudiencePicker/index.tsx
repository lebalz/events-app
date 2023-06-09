
import React, { KeyboardEventHandler }  from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { default as DepartmentModel } from '@site/src/models/Department';
import Department from './department';
import Checkbox from '../Checkbox';
import Button from '../Button';
import _ from 'lodash';
import CreatableSelect from 'react-select/creatable';
import { KlassName } from '@site/src/models/helpers/klassNames';

const createOption = (label: string) => ({
    label,
    value: label,
});



interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const untisStore = useStore('untisStore');
    const [inputValue, setInputValue] = React.useState('');
    const departmentStore = useStore('departmentStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null
    };

    const departments = _.groupBy(departmentStore.departments, d => d.letter);
    const { event } = props;
    const someDepartments = departmentStore.departments.filter(d => !!d.letter).some(d => event.departmentIds.has(d.id));
    const allDepartments = someDepartments && departmentStore.departments.filter(d => !!d.letter).every(d => event.departmentIds.has(d.id));
    const someDepartmentsD = departmentStore.departments.filter(d => d.letter < 'a').some(d => event.departmentIds.has(d.id));
    const allDepartmentsD = someDepartments && departmentStore.departments.filter(d => d.letter < 'a').every(d => event.departmentIds.has(d.id));
    const someDepartmentsF = departmentStore.departments.filter(d => d.letter > 'Z').some(d => event.departmentIds.has(d.id));
    const allDepartmentsF = someDepartments && departmentStore.departments.filter(d => d.letter > 'Z').every(d => event.departmentIds.has(d.id));

    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (!inputValue) {
            return;
        }
        switch (event.key) {
            case 'Space':
            case 'Enter':
            case 'Tab':
                if (inputValue.length === 3) {
                    const isValid = departmentStore.isValidClassGroup(inputValue);
                    if (isValid) {
                        props.event.setClassGroup(inputValue, true);
                    }
                } else if (inputValue.length === 4) {
                    const isValid = departmentStore.isValidClass(inputValue);
                    if (isValid) {
                        props.event.setClass(inputValue as KlassName, true);
                    }
                }
                setInputValue('');
                event.preventDefault();
                break;
        }
    };
    return (
        <div className={clsx(styles.audience)}>
            <div className={clsx(styles.header)}>
                <Checkbox checked={event.teachersOnly} onChange={(checked) => event.setTeachersOnly(checked)} label='Nur LP' />
                <Checkbox checked={event.klpOnly} onChange={(checked) => event.setKlpOnly(checked)} label='Nur KLP' disabled={event.teachersOnly} />
            </div>
            <div className={clsx(styles.header)}>
                <Button
                    text={'Alle Schulen'}
                    active={allDepartments}
                    color={someDepartments ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartments) {
                            departmentStore.departments.forEach(d => event.setDepartmentId(d.id, true));
                        } else {
                            departmentStore.departments.forEach(d => event.setDepartmentId(d.id, false));
                        }
                    }}
                />
                <Button
                    text={'GBSL'}
                    active={allDepartmentsD}
                    color={someDepartmentsD ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartmentsD) {
                            departmentStore.departments.forEach(d => d.letter < 'a' && event.setDepartmentId(d.id, true));
                        } else {
                            departmentStore.departments.forEach(d => d.letter < 'a' && event.setDepartmentId(d.id, false));
                        }
                    }}
                />
                <Button
                    text={'GBJB'}
                    active={allDepartmentsF}
                    color={someDepartmentsF ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartmentsF) {
                            departmentStore.departments.forEach(d => d.letter > 'Z' && event.setDepartmentId(d.id, true));
                        } else {
                            departmentStore.departments.forEach(d => d.letter > 'Z' && event.setDepartmentId(d.id, false));
                        }
                    }}
                />
            </div>
            <Tabs className={clsx(styles.tabs)}>
                {Object.keys(departments).sort().map((letter, idx) => {
                    const color = (departments[letter] as DepartmentModel[])[0].color
                    const touched = (departments[letter] as DepartmentModel[]).some(d => d.classes.some(c => event.affectsClass(c)));
                    return (
                        // @ts-ignore
                        <TabItem value={letter} label={departmentStore.letterToName(letter)} key={letter} attributes={{className: clsx(touched && styles.touched), style: {color: color}}}>
                            <Department departments={departments[letter]} event={event} />
                        </TabItem>
                    )
                })}
            </Tabs>
            <CreatableSelect
                components={{ DropdownIndicator: null }}
                inputValue={inputValue} /** used for the current typed input */
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={(newValue, meta) => {
                    switch (meta.action) {
                        case 'remove-value':
                        case 'pop-value':
                            const toRemove = meta.removedValue.value;
                            if (toRemove.length === 3) {
                                event.setClassGroup(toRemove, false);
                            } else if (toRemove.length === 4) {
                                event.setClass(toRemove as KlassName, false);
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

                    }
                    /** triggered, when values are removed */
                    // setValue(newValue)
                }}
                onInputChange={(newValue) => {
                    setInputValue(newValue)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Unbekannte Klassen"
                value={event.unknownClassIdentifiers.map(createOption)}
            />
        </div>
    )
});

export default AudiencePicker;