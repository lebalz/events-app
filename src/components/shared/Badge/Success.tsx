import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { EditIcon, Success as SuccessIcon, SIZE_S } from '../icons';
import Badge, { Base, extractSharedProps } from '.';

interface IconProps {
    size?: number;
}

type Props = IconProps & Base;

const Success = (props: Props) => {
    return (
        <Badge
            title="Erfolgreich"
            {...extractSharedProps(props)}
            className={clsx(styles.save, props.className)}
            icon={<SuccessIcon size={props.size ?? SIZE_S}  disabled={props.disabled} />}
        />
    )
};

export default Success;