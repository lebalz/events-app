import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Icon from '@mdi/react';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';


const FullScreenButton = observer(() => {
    const store = useStore('viewStore');
    if (!store.showFullscreenButton) {
        return null;
    }
    return (<div
        className={clsx(styles.button)}
        onClick={() => store.setFullscreen(!store.fullscreen)}>
        <Icon path={store.fullscreen ? mdiFullscreenExit : mdiFullscreen} size={1} />
    </div>);
});

export default FullScreenButton;