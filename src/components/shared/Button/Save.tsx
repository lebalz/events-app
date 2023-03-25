import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SaveIcon, SIZE_S } from '../icons';
import Button from '.';

interface Props {
    onClick: () => void;
}

const Save = (props: Props) => {
    return (
        <Button
            className={clsx(styles.save)}
            title="Speichern"
            onClick={props.onClick}
            icon={<SaveIcon size={SIZE_S} />}
        />
    )
};

export default Save;