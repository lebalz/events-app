import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon, DiscardIcon } from '../icons';

interface Props {
    onClick: () => void;
}

const Discard = (props: Props) => {
    return (
        <button
            className={clsx(styles.button, styles.discard, 'button', 'button--secondary', 'button--sm')}
            title="Änderungen verwerfen"
            onClick={props.onClick}
        >
            <DiscardIcon size={0.8} />
        </button>
    )
};

export default Discard;