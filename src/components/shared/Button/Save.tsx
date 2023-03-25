import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SaveIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';

interface Props {
    onClick: () => void;
}

type SaveProps = Props & Base;

const Save = (props: SaveProps) => {
    return (
        <Button
            {...extractSharedProps(props)}
            className={clsx(styles.save)}
            title="Speichern"
            onClick={props.onClick}
            icon={<SaveIcon size={SIZE_S} disabled={props.disabled} />}
        />
    )
};

export default Save;