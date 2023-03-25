import React, { MouseEventHandler, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ApiState } from '@site/src/stores/iStore';
import { ApiIcon, SIZE, SIZE_S, SIZE_XS } from '../icons';

export interface Base {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    title?: string;
    apiState?: ApiState;
    apiIconSize?: number;
    href?: string;
    iconSide?: 'left' | 'right';
    noOutline?: boolean;
    text?: string
    className?: string;
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
interface TextIconProps extends Base {
    icon: ReactNode;
    text: string;
    children?: never;
}
interface ChildrenProps extends Base {
    icon?: never;
    text?: never;
    children: ReactNode | ReactNode[];
}

type Props = IconProps | TextProps | ChildrenProps | TextIconProps;

const ButtonIcon = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    return (
        <>
            {
                props.icon && !(props.apiState && props.apiState !== ApiState.IDLE) && (
                    <span
                        className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}
                    >
                        {props.icon}
                    </span>
                )
            }
            {
                (props.apiState && props.apiState !== ApiState.IDLE) && (
                    <span
                        className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}
                    >
                        {ApiIcon[props.apiState]({ size: props.apiIconSize || SIZE_S })}
                    </span>
                )
            }
        </>
    )
}

const ButtonInner = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    const iconSide = props.iconSide ?? 'right';
    return (
        <>
            {iconSide === 'left' && <ButtonIcon {...props} />}
            <span className={clsx(textAndIcon && styles.border)}>
                {
                    props.text && <span>{props.text}</span>
                }
                {
                    props.children && props.children
                }
            </span>
            {iconSide === 'right' && <ButtonIcon {...props} />}
        </>
    )
}

const Button = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    const hasBtnClsx = props.className && props.className.includes('button--');
    const commonCls = clsx(
        styles.button, 
        !textAndIcon && styles.soloIcon, 
        'button', 
        !props.noOutline && 'button--outline',
        !hasBtnClsx && 'button--secondary',
        props.iconSide === 'left' ? styles.iconLeft : styles.iconRight,
        props.className
    );
    if (props.href) {
        /** it is a link, styled as a button */
        return (<a
            href={props.href}
            target="_blank"
            className={clsx(styles.link, commonCls)}
            title={props.title}
        >
            <ButtonInner {...props} />
        </a>);
    }
    return (
        <button
            className={clsx(commonCls)}
            title={props.title}
            onClick={props.onClick}
        >
            <ButtonInner {...props} />
        </button>
    );
};

export default Button;