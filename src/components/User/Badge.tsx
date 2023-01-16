import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';

const Badge = observer(() => {
    const userStore = useStore('userStore');
    if (userStore.current) {
        return (
            <Link to={'/login'}>
                <div className={clsx(styles.login, 'badge', 'badge--primary')}>
                    {userStore.current.shortName}
                </div>
            </Link>
        )
    }
    return (
        <div className={clsx(styles.login)}>
            <Link to={'/login'}>Login 🔑</Link>
        </div>
    )
});

export default Badge;