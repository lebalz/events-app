import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as EventModel } from '@site/src/models/Event';
import Button from '../../shared/Button';
import { mdiClose, mdiShareCircle } from '@mdi/js';
import ModalFooterEventActions from '../EventActions/ModalFooterEventActions';
import EventBody from '../EventBody';
import useResizeObserver from '../../shared/hooks/useResizeObserver';
import { translate } from '@docusaurus/Translate';
import Popup from 'reactjs-popup';
import { useHistory } from '@docusaurus/router';

interface Props {}

const EventModal = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const history = useHistory();
    const [expandedButtons, setExpandedButtons] = React.useState(4);
    const { openEventModalId } = viewStore;
    const event = eventStore.find<EventModel>(openEventModalId);
    const onResize = React.useCallback(
        (target: HTMLDivElement) => {
            const currentWidth = target.getBoundingClientRect().width;
            // 2 buttons --> 260px
            // 3 buttons --> 360px
            // 4 buttons --> 460px
            if (currentWidth > 460) {
                setExpandedButtons(4);
            } else if (currentWidth > 360) {
                setExpandedButtons(3);
            } else if (currentWidth > 260) {
                setExpandedButtons(2);
            } else {
                setExpandedButtons(1);
            }
        },
        [openEventModalId]
    );

    const ref = useResizeObserver(onResize);

    return (
        <Popup
            open={!!event}
            onClose={() => viewStore.setEventModalId()}
            modal
            closeOnEscape
            closeOnDocumentClick
            lockScroll
            nested
            overlayStyle={{ background: 'rgba(0, 0, 0, 0.2)' }}
        >
            <div className={clsx(styles.card, 'card')} ref={ref}>
                {event && (
                    <>
                        <div className={clsx(styles.header, 'card__header')}>
                            <h3>{event.description}</h3>
                        </div>
                        <div className={clsx(styles.body, 'card__body')}>
                            <EventBody event={event} hideTitle />
                        </div>
                        <div className={clsx(styles.footer, 'card__footer')}>
                            <div className={clsx('button-group button-group--block')}>
                                {event.isEditing ? (
                                    <ModalFooterEventActions
                                        event={event}
                                        onDiscard={() => viewStore.setEventModalId()}
                                        expandedButtons={expandedButtons}
                                    />
                                ) : (
                                    <>
                                        <Button
                                            color="secondary"
                                            title={translate({
                                                message: 'Fenster Schliessen',
                                                id: 'button.close.title',
                                                description: 'Button title to close a modal'
                                            })}
                                            text={
                                                expandedButtons > 2
                                                    ? translate({
                                                          message: 'Schliessen',
                                                          id: 'button.close',
                                                          description: 'Button text to close a modal'
                                                      })
                                                    : undefined
                                            }
                                            icon={mdiClose}
                                            iconSide="left"
                                            onClick={() => {
                                                viewStore.setEventModalId();
                                            }}
                                        />
                                        <Button
                                            color="blue"
                                            text={
                                                expandedButtons > 2
                                                    ? translate({
                                                          message: 'Öffnen',
                                                          id: 'button.open',
                                                          description: 'Button text for open button'
                                                      })
                                                    : undefined
                                            }
                                            title={translate({
                                                message: 'Terminseite Anzeigen',
                                                id: 'button.open.title'
                                            })}
                                            icon={mdiShareCircle}
                                            onClick={() => {
                                                viewStore.setEventModalId();
                                                history.push(event.shareUrl);
                                            }}
                                            href={event.shareUrl}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Popup>
    );
});

export default EventModal;
