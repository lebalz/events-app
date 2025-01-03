import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import Translate, { translate } from '@docusaurus/Translate';
import Popup from 'reactjs-popup';
import Button, { Base, extractSharedProps } from '../../shared/Button';
import { DeleteIcon, SIZE_S } from '../../shared/icons';
import { mdiCloseCircle, mdiTrashCan, mdiTrashCanOutline } from '@mdi/js';
import { DestroyEventAction } from '@site/src/api/event_group';

interface Props {
    onDelete: (eventAction: DestroyEventAction) => void;
    flyoutSide?: 'left' | 'right';
    size?: number;
    hasDrafts?: boolean;
}

type DeleteProps = Props & Base;

const DeleteGroup = (props: DeleteProps) => {
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
                                id="share.button.deleteGroup.confirm"
                                description="Text of the button confirm"
                            >
                                Wirklich Löschen?
                            </Translate>
                        </h4>
                    </div>
                    <div className={clsx('card__body')}>
                        <Button
                            className={clsx(styles.discard)}
                            color="secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsOpen(false);
                            }}
                            text={translate({
                                message: 'Abbrechen',
                                id: 'share.button.deleteGroup.confirm.no',
                                description: 'Text of the button confirm no'
                            })}
                            icon={mdiCloseCircle}
                            iconSide="left"
                            noWrap
                        />
                        {props.hasDrafts && (
                            <Button
                                className={clsx(styles.confirm)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    props.onDelete(DestroyEventAction.Unlink);
                                }}
                                text={translate({
                                    message: 'Nur die Gruppe',
                                    id: 'share.button.deleteGroup.confirm.groupOnly',
                                    description: 'Text of the button confirm yes'
                                })}
                                title={translate({
                                    message: 'Nur die Gruppe wird gelöscht, die Termine bleiben erhalten',
                                    id: 'share.button.deleteGroup.confirm.groupOnly.title'
                                })}
                                color="orange"
                                icon={mdiTrashCanOutline}
                                iconSide="left"
                                noWrap
                            />
                        )}
                        <Button
                            className={clsx(styles.confirm)}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.onDelete(DestroyEventAction.DestroyDrafts);
                            }}
                            text={
                                props.hasDrafts
                                    ? translate({
                                          message: 'Gruppe und Termine Löschen',
                                          id: 'share.button.deleteGroup.confirm.destroyDrafts'
                                      })
                                    : translate({
                                          message: 'Gruppe Löschen',
                                          id: 'share.button.deleteGroup.confirm.cascade'
                                      })
                            }
                            title={translate({
                                message: 'Die Gruppe und alle unveröffentlichten Termine werden gelöscht',
                                id: 'share.button.deleteGroup.confirm.cascade.title'
                            })}
                            icon={mdiTrashCan}
                            iconSide="left"
                            color="red"
                            noWrap
                        />
                    </div>
                </div>
            </Popup>
        </span>
    );
};

export default DeleteGroup;
