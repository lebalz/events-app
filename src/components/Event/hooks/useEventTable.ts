import EventTable from '@site/src/stores/ViewStores/EventTable';
import React from 'react';

export const EventTableContext = React.createContext<EventTable | null>(null);

export const useEventTable = () => {
    const eventTable = React.useContext(EventTableContext);
    if (!eventTable) {
        throw new Error('useEventTable must be used within an EventTableProvider');
    }
    return eventTable;
};
