import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import EventList from '../components/Event/EventList';
import Details from "@theme/Details";

const Table = observer(() => {
    // const viewStore = useStore('viewStore');
    const semesterStore = useStore('semesterStore');
    return (
        <Layout>
            <div>
                {semesterStore.semesters.map((semester, idx) => (
                    <Details key={idx} summary={<summary>{semester.name}</summary>} open={semester.isCurrent}>
                        <EventList events={semester.events} showFullscreenButton />
                    </Details>
                ))}
            </div>
        </Layout>
    );
});

export default Table;
