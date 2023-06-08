import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';

const MyEventsLink = observer(() => {
    const userStore = useStore('userStore');
    const location = useLocation();
    if (userStore.current) {
        const isActive = location.pathname.startsWith('/user');
        return (
            <Link
                href='pathname:///user?user-tab=events'
                className={clsx('navbar__item', 'navbar__link', isActive && 'navbar__link--active')}
                target='_self'
            >
                Meine
            </Link>
        )
    }
    return null;
});

export default MyEventsLink;