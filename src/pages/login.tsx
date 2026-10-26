import { Redirect } from '@docusaurus/router';
import Translate, { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { mdiEmail, mdiLoading, mdiMicrosoft } from '@mdi/js';
import { authClient } from '@site/src/auth-client';
import customFields from '@site/src/components/utils/customFields';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import HomepageHeader from '../components/HomepageHeader';
import Alert from '../components/shared/Alert';
import Button from '../components/shared/Button';
import { useStore } from '../stores/hooks';
import styles from './login.module.scss';
const { NO_AUTH, IS_PREVIEW } = customFields;

const LoginPage = observer(() => {
    const { data: session } = authClient.useSession();
    const rootUrl = useBaseUrl('/');
    const signInPage = useBaseUrl('/signIn');
    const authStore = useStore('authStore');
    if (session?.user || NO_AUTH) {
        return <Redirect to={rootUrl} />;
    }
    return (
        <Layout>
            <HomepageHeader />
            <main className={clsx(styles.main)}>
                <Alert type="info" className={clsx(styles.alert)}>
                    <Translate id="login.info.text">
                        Nur Lehrkräfte und Administrationsmitglieder der Schule können sich mit ihrem
                        Schul-Account anmelden.
                    </Translate>
                </Alert>
                {authStore.authErrorMessage && (
                    <Alert
                        type="danger"
                        className={clsx(styles.authErrorMessage)}
                        onDiscard={() => authStore.setAuthErrorMessage(null)}
                    >
                        {authStore.authErrorMessage}
                    </Alert>
                )}
                <div className={clsx(styles.loginPage)}>
                    <Button
                        noTransform
                        onClick={() => authStore.socialSignIn('microsoft')}
                        text={translate({
                            id: 'login.button.with_school_account.text',
                            message: 'Login mit Schul-Account',
                            description: 'the text of the button login with school account'
                        })}
                        icon={authStore.isAuthenticating === 'microsoft' ? mdiLoading : mdiMicrosoft}
                        spin={authStore.isAuthenticating === 'microsoft'}
                        iconSide="left"
                        color="blue"
                        size={2}
                        className={clsx(styles.mainLoginMethod)}
                    />
                    {IS_PREVIEW && (
                        <Button
                            href={signInPage}
                            color="black"
                            text="Email"
                            icon={mdiEmail}
                            iconSide="left"
                        />
                    )}
                </div>
            </main>
        </Layout>
    );
});

const Login = observer(() => {
    const { data: session } = authClient.useSession();
    const rootUrl = useBaseUrl('/');

    if (session?.user || NO_AUTH) {
        return <Redirect to={rootUrl} />;
    }
    return <LoginPage />;
});
export default Login;
