import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ArrowContainer, Popover, PopoverAlign, PopoverPosition } from 'react-tiny-popover';

interface Props {
    isOpen?: boolean
    onClose?: () => void
    onOpen?: () => void
    popupTitle?: string
    trigger: JSX.Element
    positions?: PopoverPosition | PopoverPosition[]
    align?: PopoverAlign
    content?: JSX.Element
    children?: JSX.Element
}


interface CardProps {
    content: JSX.Element
    header?: string | JSX.Element
}

const Card = observer((props: CardProps) => {
    return (
        <div className="card">
            {props.header && (
                <div className='card__header'>
                    <h3>{props.header}</h3>
                </div>
            )}
            <div className='card__body'>
                {props.content}
            </div>
        </div>
    );
});

const Popup = observer((props: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(!!props.isOpen);
    const isControlled = props.isOpen !== undefined && props.onOpen !== undefined;

    return (
        <Popover
            isOpen={isControlled ? props.isOpen : isPopoverOpen}
            onClickOutside={props.onClose}
            padding={0}
            align={props.align}
            positions={props.positions}            
            content={({ position, childRect, popoverRect }) => (
                <ArrowContainer
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor={'var(--ifm-color-primary)'}
                    arrowSize={8}
                >
                    <Card 
                        content={props.content || props.children}
                        header={props.popupTitle}
                    />
                </ArrowContainer>
            )}
        >
            <span 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isControlled) {
                        if (props.isOpen) {
                            props.onClose!();
                        } else {
                            props.onOpen!();
                        }
                    } else {
                        setIsPopoverOpen(!isPopoverOpen)
                    }
                }}
            >
                {props.trigger}
            </span>
        </Popover>
    )
});

export default Popup;