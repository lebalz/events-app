import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { Color, IfmColors } from '../Colors';
import Badge from '../Badge';

interface Props {
    label: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    color?: Color | string;
    className?: string;
}

const LabeledBox = observer((props: Props) => {
    const { color } = props;
    const ifmColor = color ? IfmColors[color] || color : IfmColors.blue;
    return (
        <div className={clsx(styles.labeledBox, props.className)}>
            <div className={clsx(styles.header)}>
                <Badge color={color || 'blue'} text={props.label} className={clsx(styles.label)} />
                {props.actions && <div className={clsx(styles.actions)}>{props.actions}</div>}
            </div>
            <div className={clsx(styles.content)} style={{ ['--events-boxed-color' as any]: ifmColor }}>
                {props.children}
            </div>
        </div>
    );
});

export default LabeledBox;
