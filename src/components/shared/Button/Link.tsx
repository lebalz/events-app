import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
    title?: string;
    classNames?: string[];
    label: string;
    icon?: ReactNode;
    href: string;
}


const Link = (props: Props) => {
    const cn = props.classNames || [];
    return (
        <a
            href={props.href}
            target="_blank"
            className={clsx(styles.link, 'button', 'button--secondary', ...cn)}
            title={props.title}
        >
            <span>
                <span className={clsx(styles.icon)}>
                    {props.icon}
                </span>
                {props.label}
            </span>
        </a>
    )
};

export default Link;