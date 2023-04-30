import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import EventGrid from '../components/Event/EventGrid';

const Table = observer(() => {
    const viewStore = useStore('viewStore');
    return (
        <Layout>
            <div>
                <EventGrid events={viewStore.eventTable.events} groupBy='kw' showFilter/>
            </div>
        </Layout>
    );
});

export default Table;
