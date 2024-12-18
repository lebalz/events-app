import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Translate from '@docusaurus/Translate';

import _ from 'lodash';
import { action } from 'mobx';
import Subscription from '@site/src/models/Subscription';
import Popup from 'reactjs-popup';
import Button from '../../shared/Button';
import { mdiCog } from '@mdi/js';
import useIsMobileView from '@site/src/hookes/useIsMobileView';
import { PopupPosition } from 'reactjs-popup/dist/types';
import Content from './Content';

interface Props {
    subscription: Subscription;
    className?: string;
    position?: PopupPosition | PopupPosition[];
}

const SubscriptionPanel = observer((props: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const isMobileView = useIsMobileView(470);
    return (
        <Popup
            trigger={
                <span className={clsx(props.className)}>
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                        icon={mdiCog}
                        noOutline={isOpen}
                        color={isOpen ? 'primary' : 'secondary'}
                    />
                </span>
            }
            on="click"
            closeOnDocumentClick
            overlayStyle={{ background: isMobileView ? 'rgba(0,0,0,0.5)' : undefined }}
            closeOnEscape
            position={
                props.position || [
                    'bottom center',
                    'bottom right',
                    'bottom left',
                    'left center',
                    'right center',
                    'top left',
                    'top right',
                    'top center'
                ]
            }
            keepTooltipInside="#__docusaurus"
            modal={isMobileView}
            onOpen={action(() => {
                setIsOpen(true);
            })}
            onClose={() => setIsOpen(false)}
        >
            <div className={clsx(styles.wrapper, 'card')}>
                <div className={clsx('card__header', styles.header)}>
                    <h3>
                        <Translate id="subscriptionPanel.configure.title">Abonnement Konfigurieren</Translate>
                    </h3>
                </div>
                <div className={clsx('card__body', styles.cardBody)}>
                    <Content subscription={props.subscription} />
                </div>
            </div>
        </Popup>
    );
});

export default SubscriptionPanel;
