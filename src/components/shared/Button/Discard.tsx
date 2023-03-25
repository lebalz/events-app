import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon, DiscardIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';

interface Props {
    onClick: () => void;
}

type DiscardProps = Props & Base;

const Discard = (props: DiscardProps) => {
    return (
        <Button 
            {...extractSharedProps(props)}
            className={clsx(styles.discard, 'button--secondary', 'button--sm')}
            title="Änderungen verwerfen"
            onClick={props.onClick}
            icon={<DiscardIcon size={SIZE_S} />}
        />
    );
};

export default Discard;