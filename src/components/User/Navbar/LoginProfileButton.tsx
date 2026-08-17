import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import useIsBrowser from '@docusaurus/useIsBrowser';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { mdiAccountCircleOutline, mdiLogin } from '@mdi/js';
import siteConfig from '@generated/docusaurus.config';
import { ApiState } from '@site/src/stores/iStore';
import { translate } from '@docusaurus/Translate';
import { authClient } from '@site/src/auth-client';
import useBaseUrl from '@docusaurus/useBaseUrl';
const { NO_AUTH } = siteConfig.customFields as { NO_AUTH?: boolean };
const LoginButton = () => {
    return <Button href={'/login'} text="Login" icon={mdiLogin} color="primary" iconSide="left" />;
};

const LoginProfileButton = observer(() => {
    const isBrowser = useIsBrowser();
    const { data: sessionData } = authClient.useSession();
    const userStore = useStore('userStore');
    const userUrl = useBaseUrl('/user?user-tab=account');
    if (!isBrowser) {
        return null;
    }
    if (!sessionData?.user && !NO_AUTH) {
        return <LoginButton />;
    }
    return (
        <Button
            text={userStore.current?.shortName || userStore.current?.firstName || 'Profil'}
            icon={mdiAccountCircleOutline}
            iconSide="left"
            color="primary"
            href={userUrl}
            title={translate({
                id: 'user.navbar.profile.title',
                message: 'Persönlicher Bereich'
            })}
        />
    );
});

export default LoginProfileButton;
