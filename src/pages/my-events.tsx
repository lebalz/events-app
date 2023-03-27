import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import EventList from '../components/Event/EventList';
import { useStore } from '../stores/hooks';
import clsx from 'clsx';
import LazyDetails from '../components/shared/Details';
import User from '../models/User';
import Delete from '../components/shared/Button/Delete';
import AddButton from '../components/Event/AddButton';

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const jobStore = useStore('jobStore');
    const userId = userStore.current?.id;

    return (
        <Layout>
            <div>
                <AddButton />
                <EventList events={eventStore.byUser(userId).filter(e => !e.jobId)} showFullscreenButton={false} />
                {jobStore.importJobs.map((job, idx) => {
                    return (
                        <LazyDetails
                            key={idx} 
                            summary={
                            <summary>
                                {(job.user as User)?.email} - {job.filename || '|'} - {job.state} - {job.events.length}
                            </summary>
                        }
                        >
                            <div>
                                <Delete
                                    onClick={() => {
                                        jobStore.destroy(job);
                                    }}
                                    text="Löschen"
                                    flyoutSide='right'
                                    iconSide='right'
                                    apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                />
                                <EventList events={job.events} showFullscreenButton={false} />
                            </div>
                        </LazyDetails>
                    )
                })}
            </div>
        </Layout >
    );
});

export default Table;
