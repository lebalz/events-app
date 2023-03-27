import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { Icon, SIZE, SIZE_S, SIZE_XS } from '../icons';
import Button from '../Button';


const FullScreenButton = observer(() => {
    const store = useStore('viewStore');
    if (!store.showFullscreenButton) {
        return null;
    }
    return (
        <div className={styles.bla}>
            <Button
                icon={<Icon path={store.fullscreen ? mdiFullscreenExit : mdiFullscreen} size={SIZE_S} />}
                onClick={() => store.setFullscreen(!store.fullscreen)}
                title={store.fullscreen ? 'Verlasse Vollbildschirm' : 'Vollbildschirm'}
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