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


interface Props {
}

const NavColorPicker = observer((props: Props) => {
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
                position="bottom center"
                on="click"
                closeOnDocumentClick
            >
                <ColorGenerator />
            </Popup>
        </div>
    )
});

export default NavColorPicker;