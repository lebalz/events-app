import clsx from 'clsx';
import React from 'react';

import { useColorMode } from '@docusaurus/theme-common';
import Translate, { translate } from '@docusaurus/Translate';
import { mdiClose, mdiPalette } from '@mdi/js';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Popup from 'reactjs-popup';
import { PopupActions } from 'reactjs-popup/dist/types';
import ColorGenerator from '.';
import Button from '../shared/Button';
import { SIZE_S } from '../shared/icons';
import styles from './styles.module.scss';

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
                            onClick={() => ref.current?.close()}
                        />
                    </div>
                    <ColorGenerator />
                </div>
            </Popup>
        </div>
    );
});

export default NavColorPicker;
