import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { Icon } from '../icons';

const Colors = {
    primary: styles.primary,
    blue: styles.blue,
    green: styles.green,
    red: styles.red,
    orange: styles.orange,
    gray: styles.gray,
    lightBlue: styles.lightBlue
}

export type Color = keyof typeof Colors;

export interface Base {
    color?: Color;
    title?: string;
    iconSide?: 'left' | 'right';
    noOutline?: boolean;
    text?: string
    className?: string;
    disabled?: boolean;
    size?: number;
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
        disabled: props.disabled,
        color: props.color,
        size: props.size
    }
}

const BadgeIcon = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    if (!props.icon) {
        return null;
    }
    if (typeof props.icon === 'string') {
        return (
            <span
                className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}
            >
                <Icon path={props.icon} size={props.size} />
            </span>
        )
    }

    return (
        <span
            className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}
        >
            {props.icon}
        </span>
    )
}

const BadgeInner = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    const iconSide = props.iconSide ?? 'right';
    return (
        <>
            {props.icon && iconSide === 'left' && <BadgeIcon {...props} />}
            <span className={clsx(textAndIcon && styles.border)}>
                {
                    props.text && <span>{props.text}</span>
                }
                {
                    props.children && props.children
                }
            </span>
            {props.icon && iconSide === 'right' && <BadgeIcon {...props} />}
        </>
    )
}

const Badge = (props: Props) => {
    console.log(props);
    const textOnly = props.text && !(props.children || props.icon);
    const iconOnly = props.icon && !(props.children || props.text);
    const commonCls = clsx(
        styles.badge, 
        iconOnly && styles.soloIcon,
        props.icon && !iconOnly && (props.iconSide === 'left' ? styles.iconLeft : styles.iconRight),
        textOnly && styles.soloText,
        'badge',
        Colors[props.color ?? 'gray'],
        props.className,
        props.disabled && styles.disabled
    );
    return (
        <span
            className={clsx(commonCls)}
            title={props.title}
        >
            <BadgeInner {...props} />
        </span>
    );
};

export default Badge;