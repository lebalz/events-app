import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { DeleteIcon } from '../icons';

interface Props {
    onClick: () => void;
}

const Delete = (props: Props) => {
    const [promptDelete, setPromptDelete] = React.useState(false);

    const onBlur = () => {
        setPromptDelete(false);
        document.removeEventListener('click', onBlur);
    };

    React.useEffect(() => {
        return () => {
            console.log('rem')
            document.removeEventListener('click', onBlur);
        }
    }, []);

    return (
        <span className={clsx(styles.delete)}>
            <button
                className={clsx(styles.button, styles.delete, 'button', 'button--danger', 'button--sm')}
                title="Löschen"
                onClick={(e) => {
                    console.log('add el', promptDelete);
                    setPromptDelete(!promptDelete);
                    document.addEventListener('click', onBlur);
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <DeleteIcon size={0.8} />
            </button>
            {promptDelete && (
                <div
                    className={clsx(styles.confirm, 'button', 'button--danger')}
                    onClick={(e) => {
                        console.log('pressed');
                        e.stopPropagation();
                        e.preventDefault();
                        props.onClick();
                    }}
                >
                    Ja, Löschen!
                </div>
            )}
        </span>
    )
};

export default Delete;