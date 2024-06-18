import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useWindowSize } from '@docusaurus/theme-common';
import Translate from '@docusaurus/Translate';

const AdminLink = observer(() => {
    const location = useLocation();
    const userStore = useStore('userStore');
    const windowSize = useWindowSize();
    const isMobile = windowSize === 'mobile';
    const isDesktop = !isMobile;
    if (userStore.current?.isAdmin) {
        const isActive = location.pathname.startsWith('/admin');
        return (
            <Link
                to="/admin"
                className={clsx(
                    isMobile ? 'menu__list-item menu__link' : 'navbar__item',
                    isDesktop && 'navbar__link',
                    isActive && 'navbar__link--active',
                    isMobile ? styles.mobile : styles.desktop
                )}
            >
                <Translate id="navbar.item.label.admin">Admin</Translate>
            </Link>
        );
    }
    return null;
});

export default AdminLink;
