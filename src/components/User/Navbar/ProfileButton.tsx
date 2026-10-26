import { translate } from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { mdiAccountCircleOutline } from '@mdi/js';
import useIsMobileView from '@site/src/hooks/useIsMobileView';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import Button from '../../shared/Button';
import styles from './styles.module.scss';

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
