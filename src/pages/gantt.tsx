import React from 'react';
import "gantt-task-react/dist/index.css";
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import Filter from '../components/Event/Filter';
import Gantt from '../components/Event/Views/Gantt';

const GanttView = observer(() => {
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    return (
        <Layout>
            <Filter showCurrentAndFuture />
            <Gantt events={eventTable.events} />
        </Layout>
    )
});

export default GanttView;