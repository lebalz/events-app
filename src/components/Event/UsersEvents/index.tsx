import React from 'react';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import gImport from '../EventGrid/gridConfigs/import_job.module.scss';
import { useStore } from '@site/src/stores/hooks';
import User from '@site/src/models/User';
import { EventState } from '@site/src/api/event';
import { Role } from '@site/src/api/user';
import clsx from 'clsx';
import AddButton from '../AddButton';
import BulkActions from '../BulkActions';
import EventGrid from '../EventGrid';
import LazyDetails from '../../shared/Details';
import Delete from '../../shared/Button/Delete';
import styles from './styles.module.scss';

interface Props {
    user: User;
}

const UsersEvents = observer((props: Props) => {
    const { user } = props;
    const eventStore = useStore('eventStore');
    const jobStore = useStore('jobStore');
    if (!user) {
        return null;
    }
    const myEvents = user.events.filter(e => !e.jobId);
    const drafts = myEvents.filter(e => e.state === EventState.Draft);
    const reviewed = myEvents.filter(e => [EventState.Review, EventState.Refused].includes(e.state));
    const adminReview = user?.role === Role.ADMIN ? eventStore.events.filter(e => [EventState.Review, EventState.Refused].includes(e.state)) : [];
    const published = myEvents.filter(e => e.state === EventState.Published);
    const deleted = myEvents.filter(e => e.isDeleted);

    return (
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
                            <EventGrid events={drafts} showFullscreenButton={false} gridConfig={gImport.grid} selectable />
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
                            <EventGrid events={reviewed} showFullscreenButton={false} gridConfig={gImport.grid} selectable />
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
                            <EventGrid showAuthor events={adminReview} showFullscreenButton={false} selectable />
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
                            <EventGrid events={published} showFullscreenButton={false} selectable />
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
                            <EventGrid events={deleted} showFullscreenButton={false} />
                        </div>
                    </div>
                </TabItem>
            )}
            {jobStore.importJobs.length > 0 && (
                <TabItem value='import' label='Import'>
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
                                        text="Job Löschen"
                                        flyoutSide='right'
                                        iconSide='right'
                                        apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                    />
                                    <BulkActions events={job.events.filter(e => e.selected)} />
                                    <EventGrid events={job.events} showFullscreenButton={false} gridConfig={gImport.grid} selectable />
                                </div>
                            </LazyDetails>
                        )
                    })}
                </TabItem>
            )}
        </Tabs>
    );
});

export default UsersEvents;
