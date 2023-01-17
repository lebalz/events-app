import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import Event from '../components/Event';
import EventList from '../components/Event/EventList';

const Table = observer(() => {
   return (
        <Layout>
            <div>
                <Event />
                <EventList onlyMyEvents={true} />
            </div>
        </Layout>
    );
});

export default Table;
