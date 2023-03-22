import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SaveIcon } from '../icons';

interface Props {
    onClick: () => void;
}

const Save = (props: Props) => {
    return (
        <button
            className={clsx(styles.button, styles.icon, styles.save, 'button', 'button--success', 'button--sm')}
            title="Speichern"
            onClick={props.onClick}
        >
            <SaveIcon size={0.8} />
        </button>
    )
};

export default Save;