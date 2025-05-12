import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import Translate, { translate } from '@docusaurus/Translate';
import Popup from 'reactjs-popup';

interface Props {
    onClick: () => void;
    flyoutSide?: 'left' | 'right';
    size?: number;
}

type DeleteProps = Props & Base;

const Delete = (props: DeleteProps) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <span className={clsx(styles.delete, props.className)}>
            <Popup
                trigger={(open) => (
                    <span>
                        <Button
                            {...extractSharedProps(props)}
                            icon={<DeleteIcon size={props.size ?? SIZE_S} />}
                            size={props.size ?? SIZE_S}
                            onClick={(e) => e.preventDefault()}
                            color="red"
                            title={props.title}
                        />
                    </span>
                )}
                on="click"
                open={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                position={['bottom center', 'top center']}
            >
                <div className={clsx('card')}>
                    <div className={clsx('card__header')}>
                        <h4>
                            <Translate
                                id="share.button.delete.confirm"
                                description="Text of the button confirm"
                            >
                                Wirklich Löschen?
                            </Translate>
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
                                text={translate({
                                    message: 'Nein',
                                    id: 'share.button.delete.confirm.no',
                                    description: 'Text of the button confirm no'
                                })}
                                noWrap
                            />
                            <Button
                                className={clsx(styles.confirm)}
                                color="red"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onClick();
                                }}
                                text={translate({
                                    message: 'Ja',
                                    id: 'share.button.delete.confirm.yes',
                                    description: 'Text of the button confirm yes'
                                })}
                                noWrap
                            />
                        </div>
                    </div>
                </div>
            </Popup>
        </span>
    );
};

export default Delete;
