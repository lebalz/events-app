import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon, DiscardIcon, SIZE_S } from '../icons';
import Button from '.';

interface Props {
    onClick: () => void;
}

const Discard = (props: Props) => {
    return (
        <Button 
            className={clsx(styles.discard, 'button--secondary', 'button--sm')}
            title="Änderungen verwerfen"
            onClick={props.onClick}
            icon={<DiscardIcon size={SIZE_S} />}
        />
    );
};

export default Discard;