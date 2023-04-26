import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';
import Checkbox from '@site/src/components/shared/Checkbox';
import { action } from 'mobx';

interface Props extends ReadonlyProps {
    onSelect: (selected: boolean, shiftKey: boolean) => void;
}

const Select = observer((props: Props) => {
    const { event } = props;
    return (
        <div 
            style={{gridColumn: 'select'}} 
            className={clsx('select', styles.select, props.className)}
        >
            <Checkbox checked={event.selected} onChange={props.onSelect} />
        </div>
    )
});

export default Select;