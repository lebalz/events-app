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
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Translate, { translate } from '@docusaurus/Translate';
import { toGlobalDate } from '../models/helpers/time';
import {useWindowSize} from '@docusaurus/theme-common';
const COLUMN_CONFIG: ColumnConfig = [
    'isValid',
    'state',
    'select',
    ['teachingAffected', {componentProps: {show: 'icon'}}],
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
    const adminReview = userStore.current?.isAdmin ? viewStore.allEvents({ states: [EventState.Review] }) : [];
    const published = viewStore.usersEvents({ ignoreImported: true, states: [EventState.Published] });
    const deleted = viewStore.usersEvents({ onlyDeleted: true });
    // const reviewed = myEvents.filter(e => [EventState.Review, EventState.Refused].includes(e.state));
    // const adminReview = userStore.current?.isAdmin ? eventStore.events.filter(e => [EventState.Review, EventState.Refused].includes(e.state)) : [];
    // const published = myEvents.filter(e => e.state === EventState.Published);
    // const deleted = myEvents.filter(e => e.isDeleted);
    const windowSize = useWindowSize();
    

    return (
        <Layout>
            <main className={clsx(styles.main)}>
                <Tabs lazy>
                    <TabItem value='my-events' label={
                        translate({
                            message: 'Unveröffentlicht',
                            id: 'my-events.tab.notpublished'})
                        }
                    >
                        {drafts.length > 0 && (
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3><Translate id="my-events.unpublished" description="text unpublished">Unveröffentlicht</Translate></h3>
                                </div>
                                <div className={clsx('card__body')}>
                                    <BulkActions 
                                        events={drafts} 
                                        defaultActions={
                                            <AddButton
                                                text={translate({
                                                    message: 'Neues Event',
                                                    description: 'AddButton text',
                                                    id: 'event.AddButton.text'
                                                })}
                                                onAdd={() => {
                                                    const now = toGlobalDate(new Date());
                                                    const t1 = new Date(now);
                                                    t1.setHours(t1.getHours() + 1);
                                                    eventStore.create({start: now.toISOString(), end: t1.toISOString()}).then((newEvent) => {
                                                        if (windowSize === 'mobile') {
                                                            viewStore.setEventModalId(newEvent.id);
                                                        }
                                                    })
                                                }}            
                                                apiState={eventStore.apiStateFor('create')}
                                            />
                                        }
                                    />
                                    <EventGrid events={drafts} columns={COLUMN_CONFIG} />
                                </div>
                            </div>
                        )}
                    </TabItem>
                    {reviewed.length > 0 && (
                        <TabItem value='reviewed' label={
                            translate({
                                message: 'Review',
                                id: 'my-events.tab.review'})}
                        >
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3><Translate id="my-events.review" description="text In Review">Im Review</Translate></h3>
                                </div>
                                <div className={clsx('card__body')}>
                                    <BulkActions events={reviewed} />
                                    <EventGrid events={reviewed} columns={COLUMN_CONFIG}  />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {adminReview.length > 0 && (
                        <TabItem value='admin-review' label={
                            translate({
                                message: 'Admin',
                                id: 'my-events.tab.admin'})}
                        >
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3><Translate id="my-events.review.furadmin" description="text In Review - wait for admin">Im ReviewReview Anfragen für Admin</Translate></h3>
                                </div>
                                <div className={clsx('card__body')}>
                                    <BulkActions events={adminReview} />
                                    <EventGrid events={adminReview} columns={COLUMN_CONFIG_ADMIN} />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {published.length > 0 && (
                        <TabItem value='published' label={
                            translate({
                                message: 'Veröffentlicht',
                                id: 'my-events.tab.published'})}
                        >
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3><Translate id="my-events.published" description="published">Veröffentlicht</Translate></h3>
                                </div>
                                <div className={clsx('card__body')}>
                                    <BulkActions events={published} />
                                    <EventGrid events={published} columns={COLUMN_CONFIG}  />
                                </div>
                            </div>
                        </TabItem>
                    )}
                    {deleted.length > 0 && (
                        <TabItem 
                            value='deleted'
                            label={
                                translate({
                                    message: 'Gelöscht',
                                    id: 'my-events.tab.deleted'
                                })
                            }
                        >
                            <div className={clsx(styles.card, 'card')}>
                                <div className={clsx('card__header')}>
                                    <h3><Translate id="my-events.deleted" description="deleted">Gelöscht</Translate></h3>
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
                                            <BulkActions 
                                                events={events} 
                                                defaultActions={
                                                    <Delete
                                                        onClick={() => {
                                                            jobStore.destroy(job);
                                                        }}
                                                        text={translate({
                                                            message : "Job Löschen",
                                                            id:'my-events.deleted.text' ,
                                                            description:'my-events.deleted.text'})}
                                                        flyoutSide='right'
                                                        iconSide='right'
                                                        apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                                    />
                                                }
                                            />
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
