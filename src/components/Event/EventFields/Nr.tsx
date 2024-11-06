import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { ReadonlyProps } from './iEventField';

const Nr = observer((props: ReadonlyProps) => {
    const { event } = props;
    return (
        <div style={{ gridColumn: 'nr' }} className={clsx('nr', styles.nr, props.className, 'grid-nr')}>
            {event.meta?.rowNr}
        </div>
    );
});

export default Nr;
