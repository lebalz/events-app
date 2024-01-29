import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon, SIZE_S } from '../icons';
import Button, { Base, extractSharedProps } from '.';
import Translate, { translate } from '@docusaurus/Translate';
import Popup from '../Popup';

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
                trigger={
                    <Button
                        title={translate({
                            message : "Löschen",
                            id : "share.button.delete.title",
                            description : "Text of the button delete"
                        })}
                        {...extractSharedProps(props)}
                        className={clsx(props.className, styles.delete, props.flyoutSide === 'right' && styles.right, props.className)}
                        color='red'
                        icon={<DeleteIcon size={props.size ?? SIZE_S} />}
                    />
                }
                popupTitle={
                    translate({
                        message : "Wirklich Löschen?",
                        id : "share.button.delete.confirm",
                        description : "Text of the button confirm"
                    })
                }
                isOpen={isOpen}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                align='center'    
                positions={['bottom']}
            >
                <div className={clsx('button-group', 'button-group--block')}>
                    <Button
                        className={clsx(styles.discard)}
                        color='secondary'
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsOpen(false);
                        }}
                        text={
                            translate({
                                message : "Nein",
                                id : "share.button.delete.confirm.no",
                                description : "Text of the button confirm no"
                            })
                        }
                    />
                    <Button
                        className={clsx(styles.confirm)}
                        color='red'
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            props.onClick();
                        }}
                        text={
                            translate({
                                message : "Ja",
                                id : "share.button.delete.confirm.yes",
                                description : "Text of the button confirm yes"
                            })
                        }
                    />
                </div>
            </Popup>
        </span>
        // <span className={clsx(styles.delete, promptDelete && styles.expanded, props.className)} ref={ref}>
        //     {(props.flyoutSide ?? 'left') === 'left' && Flyout}
        //     <Button
        //         title={translate({
        //             message : "Löschen",
        //             id : "share.button.delete.title",
        //             description : "Text of the button delete"
        //         })}
        //         {...extractSharedProps(props)}
        //         className={clsx(props.className, styles.delete, props.flyoutSide === 'right' && styles.right, props.className)}
        //         onClick={(e) => {
        //             setPromptDelete(!promptDelete);
        //             document.addEventListener('click', onBlur);
        //             e.stopPropagation();
        //             e.preventDefault();
        //         }}
        //         color='red'
        //         icon={<DeleteIcon size={props.size ?? SIZE_S} />}
        //     />
        //     {props.flyoutSide === 'right' && Flyout}
        // </span>
    )
};

export default Delete;