import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { default as CalendarComponent } from '../components/Event/Views/Calendar';

import Layout from '@theme/Layout';
import Filter from '../components/Event/Filter';

const Calendar = observer(() => {
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    return (
        <Layout>
            <div>
                <Filter />
                {eventTable.events.length > 0 && (
                    <CalendarComponent events={eventTable.events} />
                )}
            </div>
        </Layout>
    )
});

export default Calendar;