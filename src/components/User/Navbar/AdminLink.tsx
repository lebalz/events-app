import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';
import { Role } from '@site/src/api/user';
import { useLocation } from '@docusaurus/router';

const AdminLink = observer(() => {
    const location = useLocation();
    const userStore = useStore('userStore');
    if (userStore.current?.role === Role.ADMIN) {
        const isActive = location.pathname.startsWith('/admin');
        return (
            <Link
                to='/admin'
                className={clsx('navbar__item', 'navbar__link', isActive && 'navbar__link--active')}
            >
                Admin
            </Link>
        )
    }
    return null;
});

export default AdminLink;