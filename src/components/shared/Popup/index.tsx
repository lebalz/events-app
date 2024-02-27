import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { ArrowContainer, Popover, PopoverAlign, PopoverPosition } from 'react-tiny-popover';
import { observable } from 'mobx';

interface Props {
    isOpen?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    delay?: number;
    popupTitle?: string;
    on?: 'click' | 'hover';
    trigger: JSX.Element;
    positions?: PopoverPosition | PopoverPosition[];
    align?: PopoverAlign;
    content?: JSX.Element;
    children?: JSX.Element;
    maxWidth?: string;
    classNameTrigger?: string;
    classNamePopup?: string;
}


interface CardProps {
    content: JSX.Element
    header?: string | JSX.Element
    maxWidth?: string;
    classNamePopup?: string;
}

const Card = observer((props: CardProps) => {
    return (
        <div 
            className={clsx('card', props.classNamePopup)} 
            style={{maxWidth: props.maxWidth}}
        >
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

const ClickTrigger = observer(React.forwardRef<HTMLDivElement, TriggerProps>((props, ref) => {
    const [isOpen, setIsOpen] = React.useState(props.isOpen);
    React.useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props.isOpen]);
    return (
        <div
            ref={ref}
            onClick={(e) => {
                if (isOpen) {
                    props.onClose()
                } else {
                    props.onOpen();
                }
                setIsOpen(!isOpen);
            }}
            className={clsx(styles.trigger)}
        >
            {props.children}
        </div>
    )
}));

const HoverTrigger = observer(React.forwardRef<HTMLDivElement, TriggerProps>((props, ref) => {
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
        <div
            ref={ref}
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
        </div>
    )
}));

const Popup = observer((props: Props) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(!!props.isOpen);
    const isControlled = props.isOpen !== undefined && props.onOpen !== undefined;

    const Trigger = React.useMemo(() => {
        return props.on === 'hover' ? HoverTrigger : ClickTrigger
    }, [props.on]);

    return (
        <Popover
            isOpen={isControlled ? props.isOpen : isPopoverOpen}
            onClickOutside={() => {
                if (isControlled) {
                    if (props.onClose) {
                        props.onClose()
                    }
                } else {
                    setIsPopoverOpen(false)
                    if (props.onClose) {
                        props.onClose();
                    }
                }
            }}
            padding={0}
            align={props.align}
            positions={props.positions}
            containerStyle={{zIndex: 'calc(var(--ifm-z-index-overlay) + 10)'}}
            reposition={true}
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
                        maxWidth={props.maxWidth}
                        classNamePopup={clsx(props.classNamePopup)}
                    />
                </ArrowContainer>
            )}
        >
            {/* <span className={clsx(props.classNameTrigger)}> */}
                <Trigger
                    isOpen={isControlled ? props.isOpen : isPopoverOpen}
                    delay={props.delay}                    
                    onOpen={() => {
                        if (isControlled) {
                            props.onOpen!();
                        } else {
                            setIsPopoverOpen(true);
                            if (props.onOpen) {
                                props.onOpen();
                            }
                        }
                    }}
                    onClose={() => {
                        if (isControlled) {
                            if (props.onClose) {
                                props.onClose()
                            }
                        } else {
                            setIsPopoverOpen(false);
                            if (props.onClose) {
                                props.onClose();
                            }
                        }                    
                    }}
                >
                    {props.trigger}
                </Trigger>
                
            {/* </span> */}
        </Popover>
    )
});

export default Popup;