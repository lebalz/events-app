import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';


interface Props {
    text: string;
    onChange: (text: string) => void;
}

const TextInput = (props: Props) => {
    return (
        <div>
            <input
                type={'text'}
                value={props.text}
                onChange={(e) => {
                    props.onChange(e.currentTarget.value);
                }}
            />
        </div>
    )
};

export default TextInput;