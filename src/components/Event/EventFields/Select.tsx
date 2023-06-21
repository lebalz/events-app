import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Checkbox from '@site/src/components/shared/Checkbox';
import styles from './styles.module.scss';


interface Props extends ReadonlyProps {
    onSelect: (selected: boolean, shiftKey: boolean) => void;
}

const Select = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            data-id={event.id}
            style={{gridColumn: 'select'}} 
            className={clsx('grid-select', styles.select, props.className)}
        >
            <Checkbox checked={event.selected} onChange={props.onSelect}/>
        </div>
    )
});

export default Select;