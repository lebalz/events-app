import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import Event from '../components/Event';
import EventList from '../components/Event/EventList';

const Table = observer(() => {
    const viewStore = useStore('viewStore');
    const userStore = useStore('userStore');
    return (
        <Layout>
            <div>
                <EventList events={viewStore.eventTable.events} showFullscreenButton />
            </div>
        </Layout>
    );
});

export default Table;
