import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
    text: string | number;
    onChange: (text: string) => void;
    search?: boolean;
    autoFocus?: boolean;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    placeholder?: string;
    htmlType?: React.HTMLInputTypeAttribute;
    label?: React.ReactNode;
    required?: boolean;
    title?: string;
    noAutoFocus?: boolean;
    noSpellCheck?: boolean;
    onEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    validator?: (text: string) => string | null;
    isDirty?: boolean;
}

const TextInput = (props: Props) => {
    const ref = React.useRef<HTMLInputElement>(null);
    const id = React.useId();
    const validator = React.useCallback(props.validator ?? ((text: string) => null), [props.validator]);

    React.useEffect(() => {
        if (ref.current && props.autoFocus) {
            ref.current.focus();
        }
    }, [ref, props.autoFocus]);

    return (
        <div className={clsx(props.className, styles.textInput)}>
            {props.label && (
                <label
                    className={clsx(
                        styles.label,
                        props.labelClassName,
                        props.required && styles.required,
                        props.isDirty && styles.dirty
                    )}
                    htmlFor={id}
                    title={props.title}
                >
                    {props.label}
                </label>
            )}
            <input
                id={id}
                spellCheck={!props.noSpellCheck}
                ref={ref}
                type={props.htmlType ?? (props.search ? 'search' : 'text')}
                value={props.text}
                placeholder={props.placeholder}
                autoFocus={!!props.autoFocus}
                className={props.inputClassName}
                onChange={(e) => {
                    props.onChange(e.currentTarget.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        props.onEnter?.(e);
                    }
                }}
                onInput={(e) => {
                    const error = validator(e.currentTarget.value);
                    if (error === null) {
                        e.currentTarget.setCustomValidity('');
                    } else {
                        e.currentTarget.setCustomValidity(error);
                    }
                    e.currentTarget.classList.add(styles.touched);
                    e.currentTarget.reportValidity();
                }}
                autoComplete="off"
                autoCorrect="off"
            />
        </div>
    );
};

export default TextInput;
