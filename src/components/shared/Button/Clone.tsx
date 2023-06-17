import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import { mdiContentDuplicate } from '@mdi/js';

interface Props {
    onClick: () => void;
    size?: number;
}


type EditProps = Props & Base;

const Clone = (props: EditProps) => {
    return (
        <Button
            icon={mdiContentDuplicate}
            title='Duplizieren'
            {...extractSharedProps(props)}
            className={clsx( props.className)}
            size={props.size ?? SIZE_S}
            color='blue'
            onClick={() => {
                props.onClick();
            }}
        />
    )
};

export default Clone;