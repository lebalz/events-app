import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import EventList from '../components/Event/EventList';

const Table = observer(() => {
    const viewStore = useStore('viewStore');
    return (
        <Layout>
            <div>
                <EventList events={viewStore.eventTable.events} showFullscreenButton />
            </div>
        </Layout>
    );
});

export default Table;
