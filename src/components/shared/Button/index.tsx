import React, { MouseEventHandler, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ApiState } from '@site/src/stores/iStore';
import { ApiIcon, Icon, SIZE, SIZE_S, SIZE_XS } from '../icons';
import Link from '@docusaurus/Link';
import { Color, getButtonColorClass, getColorClass } from '../Colors';

export interface Base {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    title?: string;
    apiState?: ApiState;
    apiIconSize?: number;
    href?: string;
    target?: '_blank' | `_self`;
    iconSide?: 'left' | 'right';
    noOutline?: boolean;
    text?: string
    active?: boolean;
    className?: string;
    disabled?: boolean;
    size?: number;
    color?: Color | string;
}
interface IconProps extends Base {
    icon: ReactNode | string;
    text?: never;
    children?: never;
}
interface TextProps extends Base {
    icon?: never;
    text: string;
    children?: never;
}
interface TextIconProps extends Base {
    icon: ReactNode | string;
    text: string;
    children?: never;
}
interface ChildrenProps extends Base {
    icon?: never;
    text?: never;
    children: ReactNode | ReactNode[];
}

type Props = IconProps | TextProps | ChildrenProps | TextIconProps;

export const extractSharedProps = (props: Base) => {
    return {
        text: props.text,
        iconSide: props.iconSide,
        noOutline: props.noOutline,
        href: props.href,
        disabled: props.disabled,
        apiState: props.apiState,
        apiIconSize: props.apiIconSize,
        color: props.color,
        size: props.size
    }
}

const ButtonIcon = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    let icon = props.icon;
    if (typeof icon === 'string') {
        icon = <Icon path={icon} size={props.size} />;
    }
    return (
        <>
            {
                icon && !(props.apiState && props.apiState !== ApiState.IDLE) && (
                    <span
                        className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}
                    >
                        {icon}
                    </span>
                )
            }
            {
                (props.apiState && props.apiState !== ApiState.IDLE) && (
                    <span
                        className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}
                    >
                        {ApiIcon[props.apiState]({ size: props.apiIconSize ?? SIZE_S })}
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
            {props.icon && iconSide === 'left' && <ButtonIcon {...props} />}
            <span className={clsx(textAndIcon && styles.border)}>
                {
                    props.text && <span>{props.text}</span>
                }
                {
                    props.children && props.children
                }
            </span>
            {props.icon && iconSide === 'right' && <ButtonIcon {...props} />}
        </>
    )
}

const Button = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    const textOnly = props.text && !(props.children || props.icon);
    const colorCls = getButtonColorClass(props.color, props.color ? undefined : 'secondary' );
    const style: React.CSSProperties = {};
    if (props.color && !colorCls) {
        style['--ifm-button-border-color'] = props.color;
        style['--ifm-button-color'] = props.color;
    }
    const commonCls = clsx(
        styles.button, 
        !textAndIcon && props.icon && styles.soloIcon,
        props.icon &&( props.iconSide === 'left' ? styles.iconLeft : styles.iconRight),
        textOnly && styles.soloText,
        'button', 
        !props.noOutline && 'button--outline',
        props.active && 'button--active',
        props.disabled && styles.disabled,
        colorCls,
        props.className
    );
    if (props.href) {
        /** it is a link, styled as a button */
        return (<Link
            href={props.disabled ? '#' : props.href}
            target={props.target ?? '_blank'}
            className={clsx(styles.link, commonCls)}
            title={props.title}
            style={style}
        >
            <ButtonInner {...props} />
        </Link>);
    }
    return (
        <button
            type='button'
            className={clsx(commonCls)}
            title={props.title}
            onClick={props.onClick}
            style={style}
            disabled={props.disabled}
        >
            <ButtonInner {...props} />
        </button>
    );
};

export default Button;