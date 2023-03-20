import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
    type: 'create' | 'update' | 'delete' | 'discard';
    label: string;
    loading?: boolean;
    onClick: () => void;
}

const Button = (props: Props) => {
    return (
        <button
            className={clsx(styles.button, styles[props.type])}
            onClick={props.onClick}
            disabled={props.loading}
        >
            {props.label}
        </button>
    )
};

export default Button;