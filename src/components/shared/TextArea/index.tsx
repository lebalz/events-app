import clsx from 'clsx';
import React from 'react';

import useAutosizeTextArea from '../hooks/useAutoSizeTextArea';
import styles from './styles.module.scss';

interface Props {
    text: string;
    onChange: (text: string) => void;
    rows?: number;
    placeholder?: string;
}

const TextArea = (props: Props) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef, props.text, props.rows || 3);

    return (
        <div className={clsx(styles.textarea)}>
            <textarea
                value={props.text}
                ref={textAreaRef}
                rows={props.rows || 3}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder={props.placeholder}
            />
        </div>
    );
};

export default TextArea;
