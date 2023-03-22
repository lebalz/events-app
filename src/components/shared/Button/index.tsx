import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Base {
    onClick: () => void;
    title?: string;
    classNames?: string[];
}
interface IconProps extends Base {
    icon: ReactNode;
    text?: never;
    children?: never;
}
interface TextProps extends Base {
    icon?: never;
    text: string;
    children?: never;
}
interface ChildrenProps extends Base {
    icon?: never;
    text?: never;
    children: ReactNode | ReactNode[];
}

type Props = IconProps | TextProps | ChildrenProps; 
const Button = (props: Props) => {
    const cn = props.classNames || [];
    return (
        <button
            className={clsx(styles.button, props.icon && styles.icon, 'button', 'button--secondary', ...cn)}
            title={props.title}
            onClick={props.onClick}
        >
            {props.icon || props.text || props.children}
        </button>
    )
};

export default Button;