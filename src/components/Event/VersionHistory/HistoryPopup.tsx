import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Popup from 'reactjs-popup';
import Button from '../../shared/Button';
import Translate, { translate } from '@docusaurus/Translate';
import { mdiClose, mdiHistory } from '@mdi/js';
import { default as EventModel } from '@site/src/models/Event';
import VersionHistory from '.';
import { PopupActions } from 'reactjs-popup/dist/types';
import { SIZE_S } from '../../shared/icons';


interface Props {
    event: EventModel;
}

const HistoryPopup = observer((props: Props) => {
    const ref = React.useRef<PopupActions>();
    const {event} = props;
    return (
        <Popup
            modal
            ref={ref}
            trigger={
                <span>
                    <Button
                        text={translate({
                            message: "Versionen",
                            id: 'event.button.versions',
                            description: 'for a single event: button to show version history'
                        })}
                        title={translate({
                            message: "Versionen laden und anzeigen",
                            id: 'event.button.versions.title',
                        })}
                        icon={mdiHistory}
                        size={SIZE_S}
                        color='primary'
                    />
                </span>
            }
            onOpen={() => {
                event.loadVersions();
            }}
            closeOnEscape
            closeOnDocumentClick
            lockScroll
            nested
            overlayStyle={{ background: 'rgba(0, 0, 0, 0.2)' }}
        >
            <div className={clsx('card', styles.historyCard)}>
                <div className={clsx('card__header', styles.header)}>
                    <h3>
                        <Translate id="versions.history.modal.title">
                            Versionen
                        </Translate>                 
                    </h3>
                        <Button
                            color="red"
                            title={
                                translate({
                                    message: 'Schliessen',
                                    id: 'button.close',
                                    description: 'Button text to close a modal'
                                })
                            }
                            size={SIZE_S}
                            icon={mdiClose}
                            iconSide='left' 
                            onClick={() => ref.current.close()}
                        />
                </div>
                <div className={clsx('card__body', styles.history)}>
                    <VersionHistory event={event} />
                </div>
            </div>
        </Popup>
    )
});

export default HistoryPopup;