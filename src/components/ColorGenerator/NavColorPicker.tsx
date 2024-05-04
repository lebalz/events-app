import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from 'reactjs-popup';
import ColorGenerator from '.';
import { POPUP_BUTTON_STYLE } from '../shared/Button';
import { Icon, SIZE_S } from '../shared/icons';
import { mdiPalette, mdiPaletteAdvanced } from '@mdi/js';
import {useColorMode} from '@docusaurus/theme-common';


interface Props {
}

const NavColorPicker = observer((props: Props) => {       
    const viewStore = useStore('viewStore');
    const {colorMode, setColorMode} = useColorMode();
    React.useEffect(() => {
        viewStore.colors.updateDom(colorMode)
    }, [colorMode])
    return (
        <div className={clsx(styles.colorPicker)}>
            <Popup
                trigger={(
                    <button
                        className={clsx(
                            POPUP_BUTTON_STYLE
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                    >
                        <Icon 
                            path={mdiPalette} 
                            size={SIZE_S}
                            color={'primary'}
                        />
                    </button>                        
                )}
                on="click"
                closeOnDocumentClick
                modal
            >
                <div className={clsx(styles.wrapper)}>
                    <ColorGenerator />
                </div>
            </Popup>
        </div>
    )
});

export default NavColorPicker;