import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';


interface Props {
    label?: string;
    checked: boolean;
    partialChecked?: boolean;
    className?: string;
    disabled?: boolean;
    onChange?: (checked: boolean, shiftKey?: boolean) => void;
}

const Checkbox = observer((props: Props) => {
    return (
        <div className={clsx(styles.checkbox, props.checked && styles.checked, props.partialChecked && styles.partialChecked, props.className)}>
            <label className={clsx(styles.label, props.disabled && styles.disabled)}>
                <input
                    className={styles.checkbox}
                    type='checkbox' 
                    disabled={props.disabled}
                    onChange={action((e) => {
                        props.onChange(!props.checked, (e.nativeEvent as any).shiftKey);
                    })} 
                    checked={props.checked}
                />
                {props.label}
            </label>
        </div>
    )
});

export default Checkbox;