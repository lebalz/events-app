import { translate } from '@docusaurus/Translate';
import { mdiMinusCircle, mdiPlusCircle } from '@mdi/js';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Badge from '../Badge';
import Button from '../Button';
import { Color, IfmColors } from '../Colors';
import { SIZE_XS } from '../icons';
import styles from './styles.module.scss';

interface Props {
    label: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    color?: Color | string;
    className?: string;
    showContent?: boolean;
    onChangeVisibility?: (val: boolean) => void;
}

const LabeledBox = observer((props: Props) => {
    const { color, onChangeVisibility } = props;
    const showContent = props.showContent ?? true;
    const ifmColor = color ? (IfmColors[color as keyof typeof IfmColors] ?? color) : IfmColors.blue;
    return (
        <div
            className={clsx(styles.labeledBox, props.className, showContent && styles.showContent)}
            style={{ ['--events-boxed-color' as any]: ifmColor }}
        >
            <div className={clsx(styles.header)}>
                <Badge color={color || 'blue'} text={props.label} className={clsx(styles.label)} />
                {onChangeVisibility && (
                    <Button
                        title={
                            showContent
                                ? translate(
                                      { message: '{box} ausblenden?', id: 'labeledBox.hide.title' },
                                      { box: props.label }
                                  )
                                : translate(
                                      { message: '{box} einblenden?', id: 'labeledBox.show.title' },
                                      { box: props.label }
                                  )
                        }
                        size={SIZE_XS}
                        icon={showContent ? mdiMinusCircle : mdiPlusCircle}
                        onClick={() => {
                            onChangeVisibility(!showContent);
                        }}
                    />
                )}
                {showContent && props.actions && <div className={clsx(styles.actions)}>{props.actions}</div>}
            </div>
            {showContent && <div className={clsx(styles.content)}>{props.children}</div>}
        </div>
    );
});

export default LabeledBox;
