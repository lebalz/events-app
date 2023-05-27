import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';

const IsValid = observer((props: ReadonlyProps) => {
    const { styles, onClick } = props;
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