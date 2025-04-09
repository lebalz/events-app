import React from 'react';
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
                    if (checked && shiftKey) {
                        const idx = eventTable.events.findIndex((e) => e.id === event.id);
                        const topIdx = eventTable.events
                            .slice(0, idx)
                            .findLastIndex((e) => eventTable.selectedEventIds.has(e.id));
                        if (topIdx > -1) {
                            eventTable.setSelectedEvents(
                                eventTable.events.slice(topIdx, idx + 1).map((e) => e.id),
                                true
                            );
                        }
                    } else {
                        eventTable.setSelectedEvents([event.id], checked);
                    }
                }}
            />
        </div>
    );
});

export default Select;
