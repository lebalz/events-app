import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon } from '../icons';

interface Props {
    onClick: () => void;
    className?: string;
    flyoutSide?: 'left' | 'right';
}

const Delete = (props: Props) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const [promptDelete, setPromptDelete] = React.useState(false);

    const onBlur = () => {
        setPromptDelete(false);
        document.removeEventListener('click', onBlur);
    };

    React.useEffect(() => {
        return () => {
            document.removeEventListener('click', onBlur);
        }
    }, []);

    React.useEffect(() => {
        if (promptDelete && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [promptDelete, ref])

    const Flyout = promptDelete ? (<div
        className={clsx(styles.confirm, 'button', 'button--danger')}
        onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            props.onClick();
        }}
    >
        Ja, Löschen!
    </div>) : null;

    return (
        <span className={clsx(styles.delete)} ref={ref}>
            {(props.flyoutSide || 'left') === 'left' && Flyout}
            <button
                className={clsx(props.className, styles.button, styles.icon, styles.delete, 'button', 'button--danger', 'button--sm')}
                title="Löschen"
                onClick={(e) => {
                    setPromptDelete(!promptDelete);
                    document.addEventListener('click', onBlur);
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <DeleteIcon size={0.8} />
            </button>
            {props.flyoutSide === 'right' && Flyout}
        </span>
    )
};

export default Delete;