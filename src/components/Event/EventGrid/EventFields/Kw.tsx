import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';

const KW = observer((props: ReadonlyProps) => {
    return (
        <div 
            style={{gridColumn: 'kw'}} 
            className={clsx('kw', styles.kw, props.className)}
        >
            {props.event.kw}
        </div>
    )
});

export default KW;