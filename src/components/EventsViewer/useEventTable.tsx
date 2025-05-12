import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import React from 'react';

export const useEventTable = (events: Event[], eventTable?: EventTable) => {
    const viewStore = useStore('viewStore');
    const tableId = React.useId();

    React.useEffect(() => {
        if (eventTable) {
            return;
        }
        const table = viewStore.getOrCreateEventTable(tableId, events);
        table.setOnlyRootEvents(false);
        return () => {
            viewStore.cleanupEventTable(tableId);
        };
    }, [viewStore, tableId, eventTable]);
    React.useEffect(() => {
        if (eventTable) {
            return;
        }
        const current = viewStore.eventTables.get(tableId);
        if (events && current) {
            current.setEvents(events);
        }
    }, [tableId, viewStore, events, eventTable]);
    return eventTable ?? viewStore.eventTables.get(tableId);
};
