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
    const [space, setSpace] = React.useState<number>(-1);
    const ref = React.useRef<HTMLDivElement>(null);


    /**
     * This effect is used to calculate the space between the top of the modal and the bottom of the screen.
     * Update whenever the modal is opened or closed.
     */
    React.useEffect(() => {
        if (!props.open || space > -1) {
            return;
        }
        const docusaurus = document.getElementById('__docusaurus');
        if (ref.current && docusaurus && docusaurus.clientHeight > 0) {
            const height = docusaurus.clientHeight;
            const used = ref.current.clientHeight;
            setSpace(height - used);
        }
    }, [ref.current, props.open, space]);

    // React.useEffect(() => {
    //     if (space > 0) {
    //         return;
    //     }
    //     const onResize = () => {
    //         setSpace(-1);
    //     }
    //     return () => window.removeEventListener('resize', onResize);
    // }, [ref.current, props.open, space]);

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
            ref={ref}
        >
            {props.open && (
                <>
                    <div className={clsx(styles.content)} onClick={(e) => e.stopPropagation()}>
                        {props.children}
                    </div>
                    <div 
                        className={clsx(props.open && styles.fillScreen)} 
                        onClick={props.open ? onClose : undefined} 
                        style={props.open ? {height: `${space}px`} : undefined}
                    >
                    </div>
                </>
            )}
        </div>
    );
});

export default Modal;