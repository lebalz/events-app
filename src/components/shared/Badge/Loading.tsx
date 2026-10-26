import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import Badge, { Base, extractSharedProps } from '.';
import { Loading as LoadingIcon, SIZE_S } from '../icons';
import styles from './styles.module.scss';

interface IconProps {
    size?: number;
}

type Props = IconProps & Base;

const Error = (props: Props) => {
    return (
        <Badge
            title={translate({
                message: 'Laden',
                id: 'share.badge.loading.title',
                description: 'share.badge.loading.title'
            })}
            {...extractSharedProps(props)}
            className={clsx(styles.load, props.className)}
            icon={<LoadingIcon size={props.size ?? SIZE_S} disabled={props.disabled} />}
        />
    );
};

export default Error;
