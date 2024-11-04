import clsx from 'clsx';
import styles from './styles.module.scss';

export const Colors = {
    primary: styles.primary,
    secondary: styles.secondary,
    blue: styles.blue,
    green: styles.green,
    red: styles.red,
    orange: styles.orange,
    gray: styles.gray,
    lightBlue: styles.lightBlue,
    black: styles.black
};

export const IfmColors = {
    primary: 'var(--ifm-color-primary)',
    secondary: 'var(--ifm-color-secondary)',
    blue: 'var(--ifm-color-blue)',
    green: 'var(--ifm-color-success)',
    red: 'var(--ifm-color-danger)',
    orange: 'var(--ifm-color-warning)',
    gray: 'var(--ifm-color-secondary)',
    lightBlue: 'var(--ifm-color-info)',
    black: 'var(--ifm-font-color-base)'
};

export const ButtonColors = {
    primary: 'button--primary',
    secondary: 'button--secondary',
    blue: 'button--primary',
    green: 'button--success',
    red: 'button--danger',
    orange: 'button--warning',
    gray: 'button--secondary',
    lightBlue: 'button--info',
    black: 'button--primary'
};

export type Color = keyof typeof Colors;

export const getColorClass = (color: Color | string | undefined, defaultColor?: Color) => {
    return Colors[color] || Colors[defaultColor];
};

export const getButtonColorClass = (color: Color | string, defaultColor?: Color) => {
    return clsx(
        ButtonColors[color] || ButtonColors[defaultColor],
        color === 'blue' && styles.buttonBlue,
        color === 'black' && styles.buttonBlack
    );
};
