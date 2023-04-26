import React from 'react';
import { observer } from 'mobx-react-lite';
import Layout from '@theme/Layout';
import { useStore } from '../stores/hooks';
import clsx from 'clsx';
import LazyDetails from '../components/shared/Details';
import User from '../models/User';
import Delete from '../components/shared/Button/Delete';
import AddButton from '../components/Event/AddButton';
import EventGrid from '../components/Event/EventGrid';
import { EventState } from '../api/event';
import styles from './my-events.module.scss';

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const jobStore = useStore('jobStore');
    const userId = userStore.current?.id;
    const myEvents = eventStore.byUser(userId).filter(e => !e.jobId);

    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <AddButton />
                <div className={clsx(styles.card, 'card')}>
                    <div className={clsx('card__header')}>
                        <h3>Unveröffentlicht</h3>
                    </div>
                    <div className={clsx('card__body')}>
                        <EventGrid events={myEvents.filter(e => e.state === EventState.Draft)} showFullscreenButton={false} />
                    </div>
                </div>
                <div className={clsx(styles.card, 'card')}>
                    <div className={clsx('card__header')}>
                        <h3>Im Review</h3>
                    </div>
                    <div className={clsx('card__body')}>
                        <EventGrid events={myEvents.filter(e => [EventState.Review, EventState.Refused].includes(e.state))} showFullscreenButton={false} />
                    </div>
                </div>
                <div className={clsx(styles.card, 'card')}>
                    <div className={clsx('card__header')}>
                        <h3>Veröffentlicht</h3>
                    </div>
                    <div className={clsx('card__body')}>
                        <EventGrid events={myEvents.filter(e => e.state === EventState.Published)} showFullscreenButton={false} />
                    </div>
                </div>
                <div className={clsx(styles.card, 'card')}>
                    <div className={clsx('card__header')}>
                        <h3>Gelöscht</h3>
                    </div>
                    <div className={clsx('card__body')}>
                        <EventGrid events={myEvents.filter(e => e.state === EventState.Deleted)} showFullscreenButton={false} />
                    </div>
                </div>
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
                                <EventGrid events={job.events} showFullscreenButton={false} />
                            </div>
                        </LazyDetails>
                    )
                })}
            </main>
        </Layout >
    );
});

export default Table;
