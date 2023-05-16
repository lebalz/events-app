import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';


interface Props {
    children: React.ReactNode;
    trigger: React.ReactNode;
    className?: string;
    open: boolean;
    onClose?: () => void;
}

const Modal = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    React.useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }
        return () => {document.body.style.overflow = 'visible'};
    }, [props.open]);
    if (props.open) {
        return (
            <div
                className={clsx(styles.modal, props.className)}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.onClose) {
                        props.onClose();
                    }
                }}
            >
                <div className={clsx(styles.content)} onClick={(e) => e.stopPropagation()}>
                    {props.children}
                </div>
            </div>
        );
    }
    return <>{props.trigger}</>;
});

export default Modal;


{/* <div className={clsx('card')}>
<div className={clsx('card__header')}>
    <div className={clsx('avatar')}>
        <img
            className={clsx('avatar__photo')}
            src="https://avatars1.githubusercontent.com/u/4060187?s=460&v=4" />
        <div className={clsx('avatar__intro')}>
            <div className={clsx('avatar__name')}>Jared Palmer</div>
            <small className={clsx('avatar__subtitle')}>
                Consultant, Speaker, Lead Engineer
            </small>
        </div>
    </div>
</div>
<div className={clsx('card__image')}>
    <img
        src="https://images.unsplash.com/photo-1501619951397-5ba40d0f75da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80"
        alt="Image alt text"
        title="Logo Title Text 1" />
</div>
<div className={clsx('card__footer')}>
    <div className={clsx('button-group button-group--block')}>
        <button className={clsx('button button--secondary')}>Like</button>
        <button className={clsx('button button--secondary')}>Comment</button>
        <button className={clsx('button button--secondary')}>Share</button>
    </div>
</div>
</div> */}