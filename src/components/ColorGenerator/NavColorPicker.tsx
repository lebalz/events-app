import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from 'reactjs-popup';
import ColorGenerator from '.';
import Button, { POPUP_BUTTON_STYLE } from '../shared/Button';
import { Icon, SIZE_S } from '../shared/icons';
import { mdiPalette, mdiPaletteAdvanced } from '@mdi/js';
import {useColorMode} from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';


interface Props {
}

const NavColorPicker = observer((props: Props) => {       
    const viewStore = useStore('viewStore');
    const {colorMode, setColorMode} = useColorMode();
    React.useEffect(() => {
        viewStore.colors.setDom(colorMode)
    }, [colorMode])
    return (
        <div className={clsx(styles.colorPicker)}>
            <Popup
                trigger={(
                    <span>
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                            icon={mdiPalette}
                            title={translate({ id: 'colorPicker.title', message: 'Hauptfarbe Auswählen' })}
                            color="primary"
                        />
                    </span>
                )}
                on="click"
                closeOnDocumentClick
                modal
                overlayStyle={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
                <div className={clsx(styles.wrapper)}>
                    <ColorGenerator />
                </div>
            </Popup>
        </div>
    )
});

export default NavColorPicker;