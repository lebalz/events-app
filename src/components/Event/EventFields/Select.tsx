import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { ReadonlyProps } from './iEventField';
import Checkbox from '@site/src/components/shared/Checkbox';
import { action } from 'mobx';
import { EventState } from '@site/src/api/event';

interface Props extends ReadonlyProps {
    onSelect: (selected: boolean, shiftKey: boolean) => void;
}

const Select = observer((props: Props) => {
    const { event, styles } = props;
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