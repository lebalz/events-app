import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { Error as ErrorIcon, SIZE_S } from '../icons';
import Badge, { Base, extractSharedProps } from '.';
import Translate, { translate } from '@docusaurus/Translate';

interface IconProps {
    size?: number;
}

type Props = IconProps & Base;

const Error = (props: Props) => {
    return (
        <Badge
            title={translate({
                message : "Erreur",
                id : "share.badge.error.title",
                description : "share.badge.error.title"
            })}
            {...extractSharedProps(props)}
            className={clsx(styles.save, props.className)}
            icon={<ErrorIcon size={props.size ?? SIZE_S} disabled={props.disabled} />}
        />
    )
};

export default Error;