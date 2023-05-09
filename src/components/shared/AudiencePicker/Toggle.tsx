import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../Button';
import { mdiChevronDown, mdiChevronRight } from '@mdi/js';
import { SIZE_XS } from '../icons';
import { action } from 'mobx';


interface Props {
    marginLeft?: number;
    label?: string;
    property: string;
    disabled?: boolean;
    checked: boolean;
    collapsed?: boolean;
    className?: string;
    onCollapse?: () => void;
    onToggle: (key: string) => void;
}

const Toggle = observer((props: Props) => {
    return (
        <div className={clsx(styles.toggle, props.className, props.disabled && styles.disabled)} style={{ marginLeft: `${props.marginLeft || 0}px` }}>
            {props.onCollapse && (
                <Button icon={props.collapsed ? mdiChevronRight : mdiChevronDown} size={SIZE_XS} onClick={props.onCollapse} />
            )}
            <label className={clsx(styles.formControl)}>
                <input 
                    disabled={props.disabled}
                    className={styles.checkbox}
                    id={`tgl-${props.property}`} 
                    type='checkbox' 
                    onChange={action(() => {
                        props.onToggle(props.property);
                    })} 
                    checked={props.checked}
                />
                {props.label ?? props.property}
            </label>
        </div>
    )
});

export default Toggle;