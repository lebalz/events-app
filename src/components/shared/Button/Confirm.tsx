import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import Button, { Props as ButtonProps } from '.';
import { translate } from '@docusaurus/Translate';
import Popup from 'reactjs-popup';
import { Color } from '../Colors';
import { PopupPosition } from 'reactjs-popup/dist/types';

interface Props {
    flyoutSide?: 'left' | 'right';
    noConfirm?: boolean;
    confirmTitle: string;
    consentText?: string;
    rejectText?: string;
    confirmColor?: Color | string;
    modal?: boolean;
    position?: PopupPosition | PopupPosition[];
}

type ConfirmProps = Props & ButtonProps;

const Confirm = (props: ConfirmProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    if (props.noConfirm) {
        return <Button {...props} />;
    }

    return (
        <span className={clsx(styles.confirm, props.className)}>
            <Popup
                trigger={(open) => (
                    <span>
                        <Button
                            {...props}
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        />
                    </span>
                )}
                on="click"
                open={isOpen}
                keepTooltipInside="#__docusaurus"
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                nested
                modal={props.modal}
                overlayStyle={{ background: 'rgba(0, 0, 0, 0.2)' }}
                position={props.position}
            >
                <div className={clsx('card')}>
                    <div className={clsx('card__header')}>
                        <h4>
                            {props.confirmTitle ??
                                translate({
                                    message: 'Bestätigen',
                                    id: 'share.button.confirm.title',
                                    description: 'Default title of the confirmation dialog'
                                })}
                        </h4>
                    </div>
                    <div className={clsx('card__footer')}>
                        <div className={clsx('button-group', 'button-group--block')}>
                            <Button
                                className={clsx(styles.discard)}
                                color="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setIsOpen(false);
                                }}
                                text={
                                    props.rejectText ||
                                    translate({
                                        message: 'Nein',
                                        id: 'share.button.confirm.no',
                                        description: 'Text of the button confirm no'
                                    })
                                }
                                noWrap
                            />
                            <Button
                                className={clsx(styles.confirm)}
                                color={props.confirmColor || 'red'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onClick(e);
                                }}
                                text={
                                    props.consentText ||
                                    translate({
                                        message: 'Ja',
                                        id: 'share.button.confirm.yes',
                                        description: 'Text of the button confirm yes'
                                    })
                                }
                                noWrap
                            />
                        </div>
                    </div>
                </div>
            </Popup>
        </span>
    );
};

export default Confirm;
