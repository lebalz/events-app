import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { mdiAccountCancel, mdiAccountCheck, mdiLink, mdiLinkOff, mdiLoading, mdiTrashCan } from '@mdi/js';
import { action } from 'mobx';
import User from '@site/src/models/User';
import { useStore } from '@site/src/stores/hooks';
import Card from '../../shared/Card';
import Button from '../../shared/Button';
import { authClient } from '@site/src/auth-client';
import { Role } from '@site/src/api/user';
import { ApiState } from '@site/src/stores/iStore';
import Confirm from '../../shared/Button/Confirm';
import { SIZE_XS } from '../../shared/icons';
import TextInput from '../../shared/TextInput';
import Alert from '../../shared/Alert';
import Loader from '../../shared/Loader';

interface Props {
    user: User;
    close: () => void;
}

type SpinState =
    'deleting' | 'linking' | 'unlinking' | 'change-pw' | 'block-user' | 'unblock-user' | 'update-user';

const SPIN_TEXT = {
    deleting: 'Löschen...',
    linking: 'Verknüpfen...',
    unlinking: 'Verknüpfung aufheben...',
    'change-pw': 'Passwort ändern...',
    'block-user': 'User blockieren...',
    'unblock-user': 'Blockierung aufheben...',
    'update-user': 'Speichern...'
};

const pwValidator = (pw: string) => (pw.length > 7 ? null : 'Passwort muss min. 8 Zeichen haben');

const EditUser = observer((props: Props) => {
    const { user } = props;
    const userStore = useStore('userStore');
    const adminStore = useStore('adminStore');
    const [spinState, setSpinState] = React.useState<null | SpinState>(null);
    const [password, setPassword] = React.useState('');
    const [pwState, setPwState] = React.useState<'error' | 'success' | null>(null);

    const defaultName = React.useRef(`${user.firstName} ${user.lastName}`);
    const hasDefaultName = React.useRef(user.name === defaultName.current);
    const [name, setName] = React.useState(user.name);
    const [firstName, setFirstName] = React.useState(user.firstName);
    const [lastName, setLastName] = React.useState(user.lastName);
    React.useEffect(() => {
        if (!pwState) {
            return;
        }
        const timeout = setTimeout(() => {
            setPwState(null);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [pwState]);
    return (
        <Card
            classNames={{ card: clsx(styles.editUser), body: clsx(styles.body) }}
            footer={
                <div className={clsx('button-group button-group--block')}>
                    <Button
                        className={clsx('button--block')}
                        onClick={() => {
                            props.close();
                        }}
                        color="black"
                        text="Schliessen"
                        disabled={!!spinState}
                    />
                    <Button
                        className={clsx('button--block')}
                        color="primary"
                        onClick={() => {
                            const update: Partial<User> = {
                                firstName: firstName,
                                lastName: lastName,
                                name:
                                    hasDefaultName.current && name === user.name
                                        ? `${firstName} ${lastName}`
                                        : name
                            };
                            setSpinState('update-user');
                            authClient.admin
                                .updateUser({
                                    userId: user.id,
                                    data: update
                                })
                                .then((res) => {
                                    setSpinState(null);
                                });
                        }}
                        text="Speichern"
                        disabled={!!spinState}
                    />
                </div>
            }
        >
            <Card header={<h4>Berechtigung</h4>}>
                <div className={clsx(styles.role, 'button-group')}>
                    {Object.values(Role).map((role, idx) => (
                        <button
                            key={idx}
                            className={clsx(
                                'button',
                                'button--sm',
                                role === user.role ? 'button--primary' : 'button--secondary'
                            )}
                            onClick={() => {
                                userStore.setRole(user, role);
                            }}
                            disabled={userStore.apiStateFor(`save-role-${user.id}`) === ApiState.LOADING}
                        >
                            {role}
                        </button>
                    ))}
                </div>
                <div>
                    <h4>User Blockieren</h4>
                    <small>Verhindert das Einloggen des Users.</small>
                    {user.banned ? (
                        <Confirm
                            confirmTitle="Blockierung aufheben"
                            consentText="Wirklick aufheben?"
                            icon={mdiAccountCheck}
                            color="warning"
                            disabled={!!spinState || user.id === userStore.current?.id}
                            onClick={() => {
                                setSpinState('unblock-user');
                                authClient.admin.unbanUser({ userId: user.id }).finally(() => {
                                    setSpinState(null);
                                });
                            }}
                            size={SIZE_XS}
                        />
                    ) : (
                        <Confirm
                            confirmTitle="User blockieren"
                            consentText="Wirklick blockieren?"
                            color="red"
                            icon={mdiAccountCancel}
                            disabled={!!spinState || user.id === userStore.current?.id}
                            onClick={() => {
                                setSpinState('block-user');
                                authClient.admin.banUser({ userId: user.id }).finally(() => {
                                    setSpinState(null);
                                });
                            }}
                            size={SIZE_XS}
                        />
                    )}
                </div>
            </Card>
            <Card header={<h4>Eigenschaften</h4>}>
                <TextInput label="Nickname" text={name} onChange={setName} isDirty={name !== user.name} />
                <TextInput
                    label="Vorname"
                    text={firstName}
                    onChange={setFirstName}
                    isDirty={firstName !== user.firstName}
                />
                <TextInput
                    label="Nachname"
                    text={lastName}
                    onChange={setLastName}
                    isDirty={lastName !== user.lastName}
                />
            </Card>
            <Card
                header={
                    <>
                        <h4>Account</h4>
                        <small>
                            Ein Mail-Passwort Authentifizierungs hinterlegen. Nützlich um sich bspw. auf
                            Deploy-Previews anzumelden oder um jemandem temporät Zugriff auf den Account zu
                            geben.
                            <Alert type="warning">
                                Das permanente Hinterlegen eines Passworts stellt ein Sicherheitsrisiko dar,
                                da bspw. keine 2FA nötig ist.
                            </Alert>
                        </small>
                    </>
                }
            >
                <div className={clsx(styles.password)}>
                    <div>
                        <TextInput
                            label={user.hasEmailPasswordAuth ? 'Neues Passwort' : 'Passwort'}
                            htmlType="password"
                            text={password}
                            validator={pwValidator}
                            onChange={setPassword}
                            isDirty={!!password}
                        />
                    </div>
                    {user.hasEmailPasswordAuth ? (
                        <Button
                            text="Passwort ändern"
                            color="primary"
                            disabled={!password || !!pwValidator(password) || !!spinState}
                            onClick={() => {
                                setSpinState('change-pw');
                                adminStore
                                    .setUserPassword(user.id, password)
                                    .then((res) => {
                                        if (res.success) {
                                            setPwState('success');
                                        } else {
                                            setPwState('error');
                                        }
                                        setPassword('');
                                    })
                                    .finally(() => {
                                        setSpinState(null);
                                    });
                            }}
                        />
                    ) : (
                        <Button
                            text="Passwort-Login erstellen"
                            icon={mdiLink}
                            onClick={() => {
                                setSpinState('linking');
                                adminStore
                                    .setUserPassword(user.id, password)
                                    .then((res) => {
                                        if (res.success) {
                                            setPwState('success');
                                        } else {
                                            setPwState('error');
                                        }
                                        setPassword('');
                                    })
                                    .finally(() => {
                                        setSpinState(null);
                                    });
                            }}
                            color="primary"
                            disabled={!password || !!pwValidator(password)}
                        />
                    )}
                </div>
                {user.hasEmailPasswordAuth && (
                    <Confirm
                        confirmTitle="Passwort-Login entfernen"
                        color="red"
                        icon={mdiLinkOff}
                        onClick={() => {
                            setSpinState('unlinking');
                            adminStore.revokeUserPassword(user.id).finally(() => {
                                setSpinState(null);
                            });
                        }}
                        disabled={!!spinState}
                        size={SIZE_XS}
                        consentText="Wirklich entfernen?"
                    />
                )}
                {pwState === 'error' && <Alert type="danger">Passwort konnte nicht gesetzt werden.</Alert>}
                {pwState === 'success' && <Alert type="success">Passwort erfolgreich gesetzt.</Alert>}
            </Card>
            <Confirm
                icon={spinState ? mdiLoading : mdiTrashCan}
                confirmTitle="Löschen"
                size={SIZE_XS}
                spin={spinState === 'deleting'}
                className={clsx(styles.delete)}
                onClick={() => {
                    setSpinState('deleting');
                    authClient.admin.removeUser({ userId: user.id }).then(
                        action((res) => {
                            if (res?.data?.success) {
                                userStore.removeFromStore(user.id);
                                props.close();
                            }
                        })
                    );
                }}
                color="red"
                consentText="Wirklich löschen?"
                disabled={!userStore.current?.isAdmin || user.id === userStore.current?.id}
            />
            {!!spinState && <Loader overlay label={SPIN_TEXT[spinState]} />}
        </Card>
    );
});

export default EditUser;
