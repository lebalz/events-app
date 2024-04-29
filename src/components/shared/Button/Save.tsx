import React, { type MouseEventHandler, type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { SaveIcon, SaveVersionIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import Translate, { translate } from '@docusaurus/Translate';

interface Props {
    onClick: MouseEventHandler<HTMLButtonElement>;
    size?: number;
    newVersion?: boolean;
}

type SaveProps = Props & Base;

const Save = (props: SaveProps) => {
    return (
        <Button
            title={props.title ?? translate({
                message : "Speichern",
                id : "share.button.save.title",
                description : "Text of the button save"
            })}
            {...extractSharedProps(props)}
            className={clsx(styles.save, props.className)}
            color='green'
            onClick={props.onClick}
            icon={
                props.newVersion
                    ? <SaveVersionIcon size={props.size ?? SIZE_S} />
                    : <SaveIcon size={props.size ?? SIZE_S} />
            }
        />
    )
};

export default Save;