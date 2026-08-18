import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';

import styles from './styles.module.scss';
import { authClient } from '@site/src/auth-client';
import { Redirect } from '@docusaurus/router';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';
import { mdiLoading, mdiLogin } from '@mdi/js';
import { useStore } from '@site/src/stores/hooks';
import HomepageHeader from '@site/src/components/HomepageHeader';
import Alert from '@site/src/components/shared/Alert';
import TextInput from '@site/src/components/shared/TextInput';
import Button from '@site/src/components/shared/Button';
import { SIZE, SIZE_S } from '@site/src/components/shared/icons';

const SignIn = observer((): React.ReactNode => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const authStore = useStore('authStore');

    const { data: session } = authClient.useSession();
    React.useEffect(() => {
        return action(() => {
            authStore.setAuthErrorMessage(null);
        });
    }, [session]);

    if (session?.user) {
        return <Redirect to={'/'} />;
    }

    return (
        <Layout>
            <HomepageHeader />
            <main className={clsx(styles.main)}>
                <h2>Passwort-Login mit E-Mail</h2>
                {authStore.authErrorMessage && (
                    <Alert type="danger" onDiscard={() => authStore.setAuthErrorMessage(null)}>
                        {authStore.authErrorMessage}
                    </Alert>
                )}
                <form className={clsx(styles.form)}>
                    <TextInput
                        htmlType="email"
                        label="Email"
                        text={email}
                        className={clsx(styles.input)}
                        labelClassName={clsx(styles.label)}
                        inputClassName={clsx(styles.inputField)}
                        autoFocus
                        onChange={(val) => setEmail(val)}
                        onEnter={() => {
                            if (email && password) {
                                authStore.signInWithEmail(email, password);
                            }
                        }}
                    />
                    <TextInput
                        htmlType="password"
                        label="Passwort"
                        text={password}
                        className={clsx(styles.input)}
                        labelClassName={clsx(styles.label)}
                        inputClassName={clsx(styles.inputField)}
                        onChange={(val) => setPassword(val)}
                        onEnter={() => {
                            if (email && password) {
                                authStore.signInWithEmail(email, password);
                            }
                        }}
                    />
                    <Button
                        disabled={!email || !password}
                        onClick={async () => {
                            authStore.signInWithEmail(email, password);
                        }}
                        spin={authStore.isAuthenticating === 'email'}
                        text="Einloggen"
                        icon={authStore.isAuthenticating === 'email' ? mdiLoading : mdiLogin}
                        iconSide="left"
                        color="blue"
                        size={SIZE}
                        className={clsx(styles.signInButton)}
                        noWrap
                    />
                </form>
            </main>
        </Layout>
    );
});
export default SignIn;
