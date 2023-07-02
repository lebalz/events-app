import React from 'react';
import { observer } from 'mobx-react-lite';
import Layout from '@theme/Layout';
import { useStore } from '../stores/hooks';
import clsx from 'clsx';
import LazyDetails from '../components/shared/Details';
import User from '../models/User';
import Delete from '../components/shared/Button/Delete';
import AddButton from '../components/Event/AddButton';
import EventGrid, { ColumnConfig } from '../components/Event/EventGrid';
import { EventState } from '../api/event';
import styles from './my-events.module.scss';
import BulkActions from '../components/Event/BulkActions';
import { Role } from '../api/user';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
const COLUMN_CONFIG: ColumnConfig = [
    'isValid',
    'state',
    'select',
    'kw',
    'day',
    'description', 
    'start',
    'end',
    'userGroup',
    'location',
    'departmens',
    'classes',
    'descriptionLong',
    ['actions', {fixed: {right: 0}}]
];
const COLUMN_CONFIG_ADMIN: ColumnConfig = [...COLUMN_CONFIG.slice(0, 3), 'author', ...COLUMN_CONFIG.slice(3)]

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const jobStore = useStore('jobStore');
    const viewStore = useStore('viewStore');
    const userId = userStore.current?.id;

    // const myEvents = eventStore.byUser(userId).filter(e => !e.jobId);
    const drafts = viewStore.usersEvents({ ignoreImported: true, states: [EventState.Draft] });
    const reviewed = viewStore.usersEvents({ ignoreImported: true, states: [EventState.Review, EventState.Refused] });
    const adminReview = userStore.current?.role === Role.ADMIN ? viewStore.allEvents({ states: [EventState.Review] }) : [];
    const published = viewStore.usersEvents({ ignoreImported: true, states: [EventState.Published] });
    const deleted = viewStore.usersEvents({ onlyDeleted: true });
    // const reviewed = myEvents.filter(e => [EventState.Review, EventState.Refused].includes(e.state));
    // const adminReview = userStore.current?.role === Role.ADMIN ? eventStore.events.filter(e => [EventState.Review, EventState.Refused].includes(e.state)) : [];
    // const published = myEvents.filter(e => e.state === EventState.Published);
    // const deleted = myEvents.filter(e => e.isDeleted);
    

    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <Tabs>
                    <TabItem value='my-events' label='Unveröffentlicht'>
                        <AddButton />
                        {drafts.length > 0 && (
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3>Unveröffentlicht</h3>
                                    <BulkActions events={drafts.filter(e => e.selected)} />
                                </div>
                                <div className={clsx('card__body')}>
                                    <EventGrid events={drafts} columns={COLUMN_CONFIG} />
                                </div>
                            </div>
                        )}
                    </TabItem>
                    {reviewed.length > 0 && (
                        <TabItem value='reviewed' label='Review'>
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3>Im Review</h3>
                                    <BulkActions events={reviewed.filter(e => e.selected)} />
                                </div>
                                <div className={clsx('card__body')}>
                                    <EventGrid events={reviewed} columns={COLUMN_CONFIG}  />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {adminReview.length > 0 && (
                        <TabItem value='admin-review' label='Admin'>
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3>Review Anfragen für Admin</h3>
                                    <BulkActions events={adminReview.filter(e => e.selected)} />
                                </div>
                                <div className={clsx('card__body')}>
                                    <EventGrid events={adminReview} columns={COLUMN_CONFIG_ADMIN} />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {published.length > 0 && (
                        <TabItem value='published' label='Veröffentlicht'>
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3>Veröffentlicht</h3>
                                    <BulkActions events={published.filter(e => e.selected)} />
                                </div>
                                <div className={clsx('card__body')}>
                                    <EventGrid events={published} columns={COLUMN_CONFIG}  />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {deleted.length > 0 && (
                        <TabItem value='deleted' label='Gelöscht'>
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3>Gelöscht</h3>
                                </div>
                                <div className={clsx('card__body')}>
                                    <EventGrid events={deleted} columns={COLUMN_CONFIG} />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {jobStore.importJobs.length > 0 && (
                        <TabItem value='import' label='Import'>
                            {jobStore.importJobs.map((job, idx) => {
                                const events = viewStore.allEvents({ jobId: job.id, orderBy: 'isValid-desc' });
                                return (
                                    <LazyDetails
                                        key={idx}
                                        summary={
                                            <summary>
                                                {(job.user as User)?.email} - {job.filename || '|'} - {job.state} - {events.length}
                                            </summary>
                                        }
                                    >
                                        <div>
                                            <Delete
                                                onClick={() => {
                                                    jobStore.destroy(job);
                                                }}
                                                text="Job Löschen"
                                                flyoutSide='right'
                                                iconSide='right'
                                                apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                            />
                                            <BulkActions events={events.filter(e => e.selected)} />
                                            <EventGrid events={events} columns={COLUMN_CONFIG}  />
                                        </div>
                                    </LazyDetails>
                                )
                            })}
                        </TabItem>
                    )}
                </Tabs>
            </main>
        </Layout >
    );
});

export default Table;
