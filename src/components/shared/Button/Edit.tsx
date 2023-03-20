import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon } from '../icons';

interface Props {
    onClick: () => void;
}

const Edit = (props: Props) => {
    return (
        <button
            className={clsx(styles.button, styles.edit, 'button', 'button--info', 'button--sm')}
            title="Bearbeiten"
            onClick={props.onClick}
        >
            <EditIcon size={0.8} />
        </button>
    )
};

export default Edit;