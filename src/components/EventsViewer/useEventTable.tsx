import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import React from 'react';

export const useEventTable = (events: Event[]) => {
    const viewStore = useStore('viewStore');
    const tableId = React.useId();

    React.useEffect(() => {
        viewStore.getOrCreateEventTable(tableId, events);
        return () => {
            viewStore.cleanupEventTable(tableId);
        };
    }, [viewStore, tableId]);
    React.useEffect(() => {
        const eventTable = viewStore.eventTables.get(tableId);
        if (events && eventTable) {
            eventTable.setEvents(events);
        }
    }, [tableId, viewStore, events]);
    return viewStore.eventTables.get(tableId);
};
