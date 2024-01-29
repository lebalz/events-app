import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ArrowContainer, Popover, PopoverAlign, PopoverPosition } from 'react-tiny-popover';
import { observable } from 'mobx';

interface Props {
    isOpen?: boolean
    onClose?: () => void
    onOpen?: () => void
    delay?: number;
    popupTitle?: string
    on?: 'click' | 'hover'
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

interface TriggerProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    children: JSX.Element;
    delay?: number;
}

const ClickTrigger = observer((props: TriggerProps) => {
    const [isOpen, setIsOpen] = React.useState(props.isOpen);
    React.useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props.isOpen]);
    return (
        <span
            onClick={(e) => {
                if (isOpen) {
                    props.onClose()
                } else {
                    props.onOpen();
                }
                setIsOpen(!isOpen);
            }}
        >
            {props.children}
        </span>
    )
});

const HoverTrigger = observer((props: TriggerProps) => {
    const [isOpen, setIsOpen] = React.useState(props.isOpen);
    React.useEffect(() => {
        if (isOpen !== props.isOpen) {
            setIsOpen(props.isOpen)
        }
    }, [props.isOpen]);
    React.useEffect(() => {
        const id = setTimeout(() => {
            if (isOpen) {
                props.onOpen();
            } else {
                props.onClose();
            }
        }, props.delay || 0);
        return () => clearTimeout(id);
    }, [isOpen]);

    return (
        <span
            onMouseEnter={() => {
                setIsOpen(true);
            }}
            onMouseLeave={(e) => {
                setIsOpen(false);
            }}
            onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(!isOpen);
            }}
        >
            {props.children}
        </span>
    )
});

const Popup = observer((props: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(!!props.isOpen);
    const isControlled = props.isOpen !== undefined && props.onOpen !== undefined;

    const Trigger = React.useMemo(() => {
        return props.on === 'hover' ? HoverTrigger : ClickTrigger
    }, [props.on]);

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
            <span>
                <Trigger
                    isOpen={isControlled ? props.isOpen : isPopoverOpen}
                    delay={props.delay}
                    onOpen={() => {
                        if (isControlled) {
                            props.onOpen!();
                        } else {
                            setIsPopoverOpen(true)
                        }
                    }}
                    onClose={() => {
                        if (isControlled) {
                            props.onClose!();
                        } else {
                            setIsPopoverOpen(false)
                        }                    
                    }}
                >
                    {props.trigger}
                </Trigger>
            </span>
        </Popover>
    )
});

export default Popup;