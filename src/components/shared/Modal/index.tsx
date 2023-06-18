import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { Modal as SeModal } from 'semantic-ui-react';


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
        <SeModal
            size='fullscreen'
            onClose={() => props.onClose && props.onClose()}
            open={props.open}
            >
                <SeModal.Content scrolling>
                    {props.children}
                </SeModal.Content>
            </SeModal>

    );
});

export default Modal;