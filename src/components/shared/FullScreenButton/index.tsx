import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Button from '../Button';
import { Icon, SIZE_S } from '../icons';
import styles from './styles.module.scss';

const FullScreenButton = observer(() => {
    const store = useStore('viewStore');
    if (!store.showFullscreenButton) {
        return null;
    }
    return (
        <div className={clsx(styles.bla)}>
            <Button
                icon={<Icon path={store.fullscreen ? mdiFullscreenExit : mdiFullscreen} size={SIZE_S} />}
                onClick={() => store.setFullscreen(!store.fullscreen)}
                title={
                    store.fullscreen
                        ? translate({
                              message: 'Verlasse Vollbildschirm',
                              id: 'shared.fullscreenbutton.exitfullscreen',
                              description: 'Text of the button exit full screen'
                          })
                        : translate({
                              message: 'Vollbildschirm',
                              id: 'shared.fullscreenbutton.gofullscreen',
                              description: 'Text of the button full screen'
                          })
                }
                className={clsx(styles.button)}
            />
        </div>
    );
    // return (<div
    //     className={clsx(styles.button)}
    //     onClick={() => store.setFullscreen(!store.fullscreen)}>
    //     <Icon path={store.fullscreen ? mdiFullscreenExit : mdiFullscreen} size={SIZE} />
    // </div>);
});

export default FullScreenButton;
