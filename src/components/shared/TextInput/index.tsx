import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
    text: string;
    onChange: (text: string) => void;
    search?: boolean;
    autoFocus?: boolean;
    className?: string;
    placeholder?: string;
}

const TextInput = (props: Props) => {
    const ref = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (ref.current && props.autoFocus) {
            ref.current.focus();
        }
    }, [ref, props.autoFocus]);

    return (
        <div className={clsx(props.className, styles.textInput)}>
            <input
                ref={ref}
                type={props.search ? 'search' : 'text'}
                value={props.text}
                placeholder={props.placeholder}
                autoFocus={props.autoFocus}
                onChange={(e) => {
                    props.onChange(e.currentTarget.value);
                }}
            />
        </div>
    );
};

export default TextInput;
