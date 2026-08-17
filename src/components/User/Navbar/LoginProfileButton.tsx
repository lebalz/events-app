import React from 'react';

import useIsBrowser from '@docusaurus/useIsBrowser';
import { observer } from 'mobx-react-lite';
import Button from '../../shared/Button';
import { mdiLogin } from '@mdi/js';
import useBaseUrl from '@docusaurus/useBaseUrl';
import customFields from '../../utils/customFields';
import { authClient } from '@site/src/auth-client';
import ProfileButton from './ProfileButton';
const { NO_AUTH } = customFields;
const LoginButton = () => {
    const loginUrl = useBaseUrl('/login');
    return <Button href={loginUrl} text="Login" icon={mdiLogin} color="primary" iconSide="left" />;
};

const LoginProfileButton = observer(() => {
    const isBrowser = useIsBrowser();
    const { data: session } = authClient.useSession();

    if (!isBrowser) {
        return <LoginButton />;
    }
    if (!session?.user && !NO_AUTH) {
        return <LoginButton />;
    }

    return <ProfileButton />;
});

export default LoginProfileButton;
