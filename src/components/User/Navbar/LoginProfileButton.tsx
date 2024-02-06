import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';
import Button from '../../shared/Button';
import { mdiAccountCircleOutline } from '@mdi/js';
import { useIsAuthenticated } from '@azure/msal-react';
import siteConfig from '@generated/docusaurus.config';
import { ApiState } from '@site/src/stores/iStore';
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean};


const LoginProfileButton = observer(() => {
    const userStore = useStore('userStore');
    const isAuthenticated = useIsAuthenticated();
    if (isAuthenticated || NO_AUTH) {
        return (
            <Button
                text={userStore.current?.shortName || userStore.current?.firstName || 'Profil'}
                icon={mdiAccountCircleOutline}
                iconSide='left'
                apiState={userStore.current ? ApiState.IDLE : ApiState.LOADING}
                color='primary'
                href='/user?user-tab=account'
                title='Persönlicher Bereich'
            />
        )
    }
    return (
        <>
            <div className={clsx(styles.login)}>
                <Link to={'/login'}>Login 🔑</Link>
            </div>
        </>
    )
});

export default LoginProfileButton;