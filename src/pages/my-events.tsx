import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import Event from '../components/Event';
import EventList from '../components/Event/EventList';
import { useStore } from '../stores/hooks';
import clsx from 'clsx';
import Details from "@theme/Details";

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const jobStore = useStore('jobStore');
    const userId = userStore.current?.id;

    return (
        <Layout>
            <div>
                <Event />
                <EventList events={eventStore.byUser(userId).filter(e => !e.jobId)} />
                {jobStore.jobs.map((job, idx) => {
                    return (
                        <Details key={idx} summary={

                            <summary>
                                {job.user?.email} - {job.filename || '|'} - {job.state} - {job.events.length}
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
                                <EventList events={job.events} />
                            </div>
                        </Details>
                    )
                })}
            </div>
        </Layout >
    );
});

export default Table;
