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

const Modal = observer((props: Props) => {
    const onClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        if (props.onClose) {
            props.onClose();
        }
    }

    React.useEffect(() => {
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (props.onClose) {
                    props.onClose();
                }
            }
        }
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('keydown', onEsc);
        }
    }, [props.onClose]);

    return (
        <div
            className={clsx(props.open && styles.modal, props.open && props.className)}
            onClick={props.open ? onClose : undefined}
        >
            {props.open && (
                <div
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