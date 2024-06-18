import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { ReadonlyProps } from './iEventField';

const KW = observer((props: ReadonlyProps) => {
    const { event } = props;
    return (
        <div style={{ gridColumn: 'kw' }} className={clsx('kw', styles.kw, props.className, 'grid-kw')}>
            {props.event.kw}
        </div>
    );
});

export default KW;
