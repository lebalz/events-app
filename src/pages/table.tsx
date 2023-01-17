import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import Event from '../components/Event';
import EventList from '../components/Event/EventList';

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    console.log(eventStore.events.length);
    return (
        <Layout>
            <div>
                <Event />
                <EventList />
            </div>
        </Layout>
    );
});

export default Table;
