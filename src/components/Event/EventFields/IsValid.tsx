import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';

import { ReadonlyProps } from './iEventField';

const IsValid = observer((props: ReadonlyProps) => {
    const { onClick } = props;
    return (
        <div 
            style={{gridColumn: 'isValid'}} 
            className={clsx('isValid', styles.isValid, props.className, 'grid-isValid')}
            onClick={onClick}
        >
            {props.event.isValid ? '' : '❌'}
        </div>
    )
});

export default IsValid;