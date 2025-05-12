import React, { ComponentProps, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { Icon } from '../icons';
import { Color, getColorClass } from '../Colors';
import Tooltip from '../Tooltip';

export interface Base {
    color?: Color | string;
    title?: string | React.ReactNode;
    iconSide?: 'left' | 'right';
    noOutline?: boolean;
    text?: string;
    className?: string;
    disabled?: boolean;
    size?: number;
    inline?: boolean;
    tooltipProps?: Partial<ComponentProps<typeof Tooltip>>;
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
    icon?: ReactNode | string;
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
    };
};

const BadgeIcon = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    if (!props.icon) {
        return null;
    }
    let icon = props.icon;
    if (typeof icon === 'string') {
        icon = <Icon path={icon} size={props.size} />;
    }
    return <span className={clsx(textAndIcon && styles.inlineIcon, styles.icon)}>{icon}</span>;
};

const BadgeInner = (props: Props) => {
    const textAndIcon = (props.children || props.text) && props.icon;
    const iconSide = props.iconSide ?? 'right';
    return (
        <>
            {props.icon && iconSide === 'left' && <BadgeIcon {...props} />}
            <span className={clsx(textAndIcon && styles.border)}>
                {props.text && <span>{props.text}</span>}
                {props.children && props.children}
            </span>
            {props.icon && iconSide === 'right' && <BadgeIcon {...props} />}
        </>
    );
};

const Badge = (props: Props) => {
    const textOnly = props.text && !(props.children || props.icon);
    const iconOnly = props.icon && !(props.children || props.text);
    const colorCls = getColorClass(props.color, props.color ? undefined : 'secondary');
    const style: React.CSSProperties = {};
    if (props.color && !colorCls) {
        style['--ifm-badge-background-color'] = props.color;
        style['--ifm-badge-border-color'] = props.color;
        style['--ifm-badge-color'] = 'white';
        style.color = 'white'; /** hackibus */
    }
    const commonCls = clsx(
        styles.badge,
        iconOnly && styles.soloIcon,
        props.icon && !iconOnly && (props.iconSide === 'left' ? styles.iconLeft : styles.iconRight),
        textOnly && styles.soloText,
        'badge',
        colorCls,
        props.className,
        props.disabled && styles.disabled
    );
    return (
        <Tooltip title={props.title} {...(props.tooltipProps || {})}>
            <span className={clsx(commonCls, styles.tooltiped, props.inline && styles.inline)} style={style}>
                <BadgeInner {...props} />
            </span>
        </Tooltip>
    );
};

export default Badge;
