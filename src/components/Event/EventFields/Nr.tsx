import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { ReadonlyProps } from './iEventField';

const Nr = observer((props: ReadonlyProps) => {
    return (
        <div style={{ gridColumn: 'nr' }} className={clsx('nr', styles.nr, props.className, 'grid-nr')}>
            {props.event.meta?.rowNr}
        </div>
    );
});

export default Nr;
