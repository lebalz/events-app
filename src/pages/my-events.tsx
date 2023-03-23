import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import Event from '../components/Event';
import EventList from '../components/Event/EventList';
import { useStore } from '../stores/hooks';
import clsx from 'clsx';
import LazyDetails from '../components/shared/Details';
import User from '../models/User';

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const jobStore = useStore('jobStore');
    const userId = userStore.current?.id;

    return (
        <Layout>
            <div>
                <Event />
                <EventList events={eventStore.byUser(userId).filter(e => !e.jobId)} showFullscreenButton={false} />
                {jobStore.models.map((job, idx) => {
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
                                <button aria-label="Close" className="clean-btn close" type="button" onClick={
                                    () => {
                                        jobStore.destroy(job);
                                    }
                                }>
                                    <span aria-hidden="true">&times;</span>
                                </button>
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
