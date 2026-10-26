import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import Badge, { Base, extractSharedProps } from '.';
import { SIZE_S, Success as SuccessIcon } from '../icons';
import styles from './styles.module.scss';

interface IconProps {
    size?: number;
}

type Props = IconProps & Base;

const Success = (props: Props) => {
    return (
        <Badge
            title={translate({
                message: 'Erfolgreich',
                id: 'share.badge.success.title',
                description: 'share.badge.success.title'
            })}
            {...extractSharedProps(props)}
            className={clsx(styles.save, props.className)}
            icon={<SuccessIcon size={props.size ?? SIZE_S} disabled={props.disabled} />}
        />
    );
};

export default Success;
