import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';

interface Props {
    onClick: () => void;
    size?: number;
}


type EditProps = Props & Base;

const Edit = (props: EditProps) => {
    return (
        <Button
            title="Bearbeiten"
            {...extractSharedProps(props)}
            className={clsx(styles.edit, props.className)}
            color='orange'
            onClick={props.onClick}
            icon={<EditIcon size={props.size ?? SIZE_S} />}
        />
    )
};

export default Edit;