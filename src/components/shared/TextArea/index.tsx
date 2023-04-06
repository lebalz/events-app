import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import useAutosizeTextArea from '../hooks/useAutoSizeTextArea';


interface Props {
    text: string;
    onChange: (text: string) => void;
}

const TextArea = (props: Props) => {
    const [textAreaRef, setTextAreaRef] = React.useState<HTMLTextAreaElement>(null);
    useAutosizeTextArea(textAreaRef, props.text);

    return (
        <div className={clsx(styles.textarea)}>
            <textarea
                value={props.text}
                ref={setTextAreaRef}
                rows={1}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
};

export default TextArea;