import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import Translate, { translate } from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface Props {
    label?: string;
    overlay?: boolean;
    size?: number;
    className?: string;
    noLabel?: boolean;
    title?: string;
    align?: 'center' | 'left' | 'right';
}

const Loader = (props: Props) => {
    const canUseBrowser = useIsBrowser();
    return (
        <div
            className={clsx(
                styles.loader,
                props.className,
                props.overlay && styles.overlay,
                props.align && styles[props.align]
            )}
            title={props.title}
        >
            <Icon path={mdiLoading} spin={canUseBrowser} size={props.size || 1} className={styles.icon} />
            {!props.noLabel && (
                <span className={clsx('badge', styles.badge)}>
                    {props.label ||
                        translate({
                            message: 'Laden...',
                            id: 'components.shared.loader.loading'
                        })}
                </span>
            )}
        </div>
    );
};

export default Loader;
