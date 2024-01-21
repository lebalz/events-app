import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { Loading as LoadingIcon, SIZE_S } from '../icons';
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
                message : "Laden",
                id : "share.badge.loading.title",
                description : "share.badge.loading.title"
            })}
            {...extractSharedProps(props)}
            className={clsx(styles.load, props.className)}
            icon={<LoadingIcon size={props.size ?? SIZE_S} disabled={props.disabled} />}
        />
    )
};

export default Error;