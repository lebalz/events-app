import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';

interface Props {
    onClick: () => void;
}


type EditProps = Props & Base;

const Edit = (props: EditProps) => {
    return (
        <Button
            {...extractSharedProps(props)}
            className={clsx(styles.edit, 'button--warning')}
            title="Bearbeiten"
            onClick={props.onClick}
            icon={<EditIcon size={SIZE_S} />}
        />
    )
};

export default Edit;