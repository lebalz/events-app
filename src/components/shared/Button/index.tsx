import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
    onClick: () => void;
    title?: string;
    classNames?: string[];
    icon?: ReactNode | string;
}

const Button = (props: Props) => {
    const cn = props.classNames || [];
    return (
        <button
            className={clsx(styles.button, 'button', 'button--secondary', ...cn)}
            title={props.title}
            onClick={props.onClick}
        >
            {props.icon}
        </button>
    )
};

export default Button;