import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react-lite';
import { ReadonlyProps } from './iEventField';
import Checkbox from '@site/src/components/shared/Checkbox';
import styles from './styles.module.scss';
import Event from '@site/src/models/Event';
import EventTable from '@site/src/stores/ViewStores/EventTable';

interface Props extends ReadonlyProps {
    onSelect: (event: Event, selected: boolean, shiftKey: boolean) => void;
    eventTable: EventTable;
}

const Select = observer((props: Props) => {
    const { event, eventTable } = props;
    return (
        <div
            data-id={event.id}
            style={{ gridColumn: 'select' }}
            className={clsx('grid-select', styles.select, props.className)}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <Checkbox
                checked={eventTable.selectedEventIds.has(event.id)}
                onChange={(checked, shiftKey) => {
                    eventTable.setEventSelected(event.id, checked);
                    // props.onSelect(event, checked, shiftKey);
                }}
            />
        </div>
    );
});

export default Select;
