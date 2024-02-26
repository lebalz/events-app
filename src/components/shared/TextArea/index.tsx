import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea';


interface Props {
    text: string;
    onChange: (text: string) => void;
    rows?: number;
    placeholder?: string;
}

const TextArea = (props: Props) => {
    const [textAreaRef, setTextAreaRef] = React.useState<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef, props.text, props.rows || 3);

    return (
        <div className={clsx(styles.textarea)}>
            <textarea
                value={props.text}
                ref={setTextAreaRef}
                rows={props.rows || 3}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder={props.placeholder}
            />
        </div>
    )
};

export default TextArea;