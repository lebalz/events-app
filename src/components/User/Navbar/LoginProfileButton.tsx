import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Link from '@docusaurus/Link';
import Button from '../../shared/Button';
import { mdiAccountCircleOutline, mdiRefresh } from '@mdi/js';
import Modal from '../../shared/Modal';
import Translate, { translate } from '@docusaurus/Translate';
import siteConfig from '@generated/docusaurus.config';
const { TEST_USERNAME, TEST_USER_ID } = siteConfig.customFields as { TEST_USERNAME?: string, TEST_USER_ID?: string };

const noAuth = process.env.NODE_ENV !== 'production' && TEST_USERNAME?.length > 0 && TEST_USER_ID?.length > 0;

const LoginProfileButton = observer(() => {
    const userStore = useStore('userStore');
    const sessionStore = useStore('sessionStore');
    if (userStore.current) {
        return (
            <Button
                text={userStore.current.shortName || userStore.current.firstName}
                icon={mdiAccountCircleOutline}
                iconSide='left'
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
            {sessionStore.needsRefresh && !noAuth && (
                <Modal
                    open={sessionStore.needsRefresh}
                >
                    <div className={clsx(styles.card, 'card')}>
                        <div className={clsx('card__header')}>
                            <h3>
                                <Translate id='navbar.loginProfileButton.modal.header' description='When the login token must be recreated'>
                                    Session abgelaufen
                                </Translate>
                            </h3>
                        </div>
                        <div className={clsx('card__body')}>
                            <p>
                                <Translate id='navbar.loginProfileButton.modal.body' description='When the login token must be recreated'>
                                    Die Sicherheitsvalidierung mit Office 365 muss erneuert werden.
                                </Translate>
                            </p>
                        </div>
                        <div className={clsx('card__footer')}>
                            <div className="button-group button-group--block">
                                <Button
                                    onClick={() => sessionStore.logout()}
                                    text="Logout"
                                    color='red'
                                    noOutline
                                    className={clsx(styles.logout)}
                                />
                                <Button
                                    text={translate({
                                        message: "Aktualisieren",
                                        id: 'user.button.refresh.text',
                                        description: 'user.button.refresh.text'
                                    })}
                                    icon={mdiRefresh}
                                    iconSide='left'
                                    color="orange"
                                    onClick={() => sessionStore.refresh()}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
});

export default LoginProfileButton;