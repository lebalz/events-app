import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';

interface Option<T> {
    value: T;
    active?: boolean;
    label?: string;
    color?: string;
}

interface Props<T> {
    values: Option<T>[];
    onChange: (value: T) => void;
}

const ToggleFilter = observer(<T extends string>(props: Props<T>) => {
    const { values, onChange } = props;
    return (
        <div className={clsx(styles.toggleFilter)}>
            {values.map((item, idx) => (
                <div
                    key={idx}
                    style={{ ['--color' as any]: item.color || 'var(--ifm-color-primary)' }}
                    onClick={() => onChange(item.value)}
                    className={clsx('badge', styles.toggle, item.active && styles.active)}
                >
                    {item.label || item.value}
                </div>
            ))}
        </div>
    );
});

export default ToggleFilter;
