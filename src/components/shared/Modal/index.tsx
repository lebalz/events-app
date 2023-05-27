import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';


interface Props {
    children: React.ReactNode;
    className?: string;
    open: boolean;
    onClose?: () => void;
}

const MARGIN_TOP = 42;

const Modal = observer((props: Props) => {
    const [marginTop, setMarginTop] = React.useState(MARGIN_TOP);
    React.useEffect(() => {
        if (props.open) {
            const top = window.scrollY;
            setMarginTop(top + MARGIN_TOP);
            console.log(top);
        }
    }, [props.open]);

    const onClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (props.onClose) {
            props.onClose();
        }
    }

    return (
        <div
            className={clsx(props.open && styles.modal, props.open && props.className)}
            onClick={props.open ? onClose : undefined}
        >
            {props.open && (
                <div
                    style={{marginTop: `${marginTop}px`}}
                    className={clsx(styles.content)} 
                    onClick={(e) => e.stopPropagation()}
                >
                    {props.children}
                </div>
            )}
        </div>
    );
});

export default Modal;