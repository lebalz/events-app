import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import Translate from '@docusaurus/Translate';
import { useWindowSize } from '@docusaurus/theme-common';

const MyEventsLink = observer(() => {
    const userStore = useStore('userStore');
    const location = useLocation();
    const windowSize = useWindowSize();
    const isMobile = windowSize === 'mobile';
    const isDesktop = !isMobile;
    if (userStore.current) {
        const isActive = location.pathname.startsWith('/user');
        return (
            <Link
                to="/user?user-tab=events"
                className={clsx(
                    isMobile ? 'menu__list-item menu__link' : 'navbar__item',
                    isDesktop && 'navbar__link',
                    isActive && 'navbar__link--active',
                    isMobile ? styles.mobile : styles.desktop
                )}
            >
                <Translate id="navbar.item.label.personal">Persönlich</Translate>
            </Link>
        );
    }
    return null;
});

export default MyEventsLink;
