import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SIZE_S } from '../icons';
import Button from '.';

interface Props {
    onClick: () => void;
}

const Edit = (props: Props) => {
    return (
        <Button
            className={clsx(styles.edit, 'button--warning')}
            title="Bearbeiten"
            onClick={props.onClick}
            icon={<EditIcon size={SIZE_S} />}
        />
    )
};

export default Edit;