import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';

const KW = observer((props: ReadonlyProps) => {
    const { styles } = props;
    return (
        <div 
            style={{gridColumn: 'kw'}} 
            className={clsx('kw', styles.kw, props.className, 'grid-kw')}
            onClick={() => props.event.setExpanded(true)}
        >
            {props.event.kw}
        </div>
    )
});

export default KW;