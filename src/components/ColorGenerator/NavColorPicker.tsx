import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from 'reactjs-popup';
import ColorGenerator from '.';
import Button, { POPUP_BUTTON_STYLE } from '../shared/Button';
import { Icon, SIZE_S } from '../shared/icons';
import { mdiClose, mdiPalette, mdiPaletteAdvanced } from '@mdi/js';
import { useColorMode } from '@docusaurus/theme-common';
import Translate, { translate } from '@docusaurus/Translate';
import { PopupActions } from 'reactjs-popup/dist/types';

interface Props {}

const NavColorPicker = observer((props: Props) => {
    const ref = React.useRef<PopupActions>(null);
    const viewStore = useStore('viewStore');
    const { colorMode, setColorMode } = useColorMode();
    React.useEffect(() => {
        viewStore.colors.setDom(colorMode);
    }, [colorMode]);
    return (
        <div className={clsx(styles.colorPicker)}>
            <Popup
                ref={ref}
                trigger={
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
                }
                on="click"
                closeOnDocumentClick
                closeOnEscape
                modal
            >
                <div className={clsx(styles.wrapper, 'card')}>
                    <div className={clsx('card__header', styles.header)}>
                        <h3>
                            <Translate id="versions.navColorPicker.modal.title">Hauptfarbe Wählen</Translate>
                        </h3>
                        <Button
                            color="red"
                            title={translate({
                                message: 'Schliessen',
                                id: 'button.close',
                                description: 'Button text to close a modal'
                            })}
                            size={SIZE_S}
                            icon={mdiClose}
                            iconSide="left"
                            onClick={() => ref.current.close()}
                        />
                    </div>
                    <ColorGenerator />
                </div>
            </Popup>
        </div>
    );
});

export default NavColorPicker;
