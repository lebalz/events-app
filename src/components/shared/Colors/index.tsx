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
