import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';


interface Props {
    text: string;
    maxChars?: number;
    onChange: (text: string) => void;
}

const LongTextInput = (props: Props) => {
    const maxChars = props.maxChars || 80;
    const {text} = props;
    const lines = Math.ceil(text.length / maxChars);
    return (
        <div>
            <textarea
                value={props.text}
                wrap={'soft'}
                rows={Math.max(2, lines)}
                onChange={(e) => {
                    props.onChange(e.currentTarget.value.replace(/\n\r?/g, ' ').replace(/\s+/g, ' '));
                }}
            />
        </div>
    )
};

export default LongTextInput;