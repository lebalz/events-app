import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import React from 'react';
import { ColumnConfig } from '../Event/Views/Grid';

/**
 * @info ColumnConfig can't be changed on the fly,
 *      it is constant for the lifetime of the EventTable...
 *      --> use `eventTable.setColumnConfig(colConf)` instead
 */
export const useEventTable = (events: Event[], columnConfig: ColumnConfig, eventTable?: EventTable) => {
    const viewStore = useStore('viewStore');
    const tableId = React.useId();

    React.useEffect(() => {
        if (eventTable) {
            return;
        }
        const table = viewStore.getOrCreateEventTable(tableId, columnConfig, events);
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
