import { mdiAccountCircleOutline } from '@mdi/js';
import clsx from 'clsx';
import styles from './styles.module.scss';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import useIsMobileView from '@site/src/hooks/useIsMobileView';
import Button from '../../shared/Button';
import { translate } from '@docusaurus/Translate';

interface Props {
    preventClick?: boolean;
}

const ProfileButton = observer(({ preventClick = false }: Props) => {
    const isMobile = useIsMobileView(502);
    const userStore = useStore('userStore');
    const userUrl = useBaseUrl('/user?user-tab=account');

    return (
        <div className={clsx(styles.profileButton, isMobile && styles.collapsed)}>
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
                className={clsx(styles.button)}
            />
        </div>
    );
});

export default ProfileButton;
