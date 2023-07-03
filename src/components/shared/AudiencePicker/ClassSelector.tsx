import React, { KeyboardEventHandler } from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import CreatableSelect from 'react-select/creatable';
import { KlassName } from '@site/src/models/helpers/klassNames';

const createOption = (label: string) => ({
    label,
    value: label,
});


interface Props {
    event: EventModel;
}

const ClassSelector = observer((props: Props) => {
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const [inputValue, setInputValue] = React.useState('');
    const departmentStore = useStore('departmentStore');
    const { event } = props;

    const handleToken = (token: string, action: 'add' |'remove') => {
        if (token.length === 3) {
            const isValid = departmentStore.isValidClassGroup(token);
            if (isValid) {
                props.event.setClassGroup(token, action === 'add');
                setErrorMessages([]);
                return true;
            }
            setErrorMessages([`Abteilung "${token.charAt(2)}" nicht gefunden`]);
        } else if (token.length === 4) {
            const isValid = departmentStore.isValidClass(token);
            if (isValid) {
                props.event.setClass(token as KlassName, action === 'add');
                setErrorMessages([]);
                return true;
            }
            setErrorMessages([`Klasse "${token}" nicht gefunden`]);
        } else {
            setErrorMessages([`Unbekannte Abteilung/Klasse "${token}"`]);
        }
        return false;
    }
    
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
    return (
        <div>
            <CreatableSelect
                    components={{ DropdownIndicator: null }}
                    inputValue={inputValue} /** used for the current typed input */
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={(newValue, meta) => {
                        /** triggered, when values are removed */
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
                    }}
                    onInputChange={(newValue) => {
                        setInputValue(newValue)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Unbekannte Klassen"
                    value={event.unknownClassIdentifiers.map(createOption)}
                />
                {errorMessages.map((errorMessage, idx) => (
                    <div key={idx} style={{ color: 'red' }}>
                        {errorMessage}
                    </div>
                ))}
        </div>
    )
});

export default ClassSelector;