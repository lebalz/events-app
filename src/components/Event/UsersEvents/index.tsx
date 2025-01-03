import React from 'react';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '@site/src/stores/hooks';
import User from '@site/src/models/User';
import { EventState } from '@site/src/api/event';
import { Role } from '@site/src/api/user';
import clsx from 'clsx';
import AddButton from '../AddButton';
import BulkActions from '../BulkActions';
import LazyDetails from '../../shared/Details';
import Delete from '../../shared/Button/Delete';
import styles from './styles.module.scss';
import Grid, { ColumnConfig } from '../Views/Grid';
import Translate, { translate } from '@docusaurus/Translate';
import { formatDate, toGlobalDate, toLocalDate } from '@site/src/models/helpers/time';
import { useWindowSize } from '@docusaurus/theme-common';
import Badge from '../../shared/Badge';
import RegPeriodBadge from '../../RegistrationPeriod/RegPeriodBadge';
import EventsViewer, { View } from '../../EventsViewer';
import ChangeViewAction from '../../EventsViewer/ChangeViewAction';
import { SIZE } from '../../shared/icons';
import ToReview from './ToReview';
export const COLUMN_CONFIG: ColumnConfig = [
    'isValid',
    ['state', { sortable: false, width: undefined }],
    'select',
    ['teachingAffected', { componentProps: { show: 'icon' } }],
    'kw',
    'day',
    'description',
    'start',
    'end',
    ['location', { sortable: true }],
    'createdAt',
    'updatedAt',
    'userGroup',
    ['departmens', {}],
    ['classes', {}],
    'descriptionLong',
    ['actions', { fixed: { right: 0 } }]
];
const COLUMN_CONFIG_ADMIN: ColumnConfig = [...COLUMN_CONFIG.slice(0, 3), 'author', ...COLUMN_CONFIG.slice(3)];

interface Props {
    user: User;
}

const AddEventButton = observer(() => {
    const eventStore = useStore('eventStore');
    const windowSize = useWindowSize();
    const viewStore = useStore('viewStore');
    return (
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
                eventStore.create({ start: now.toISOString(), end: t1.toISOString() }).then((newEvent) => {
                    if (windowSize === 'mobile') {
                        viewStore.setEventModalId(newEvent.id);
                    }
                });
            }}
            apiState={eventStore.apiStateFor('create')}
            title={translate({
                message: 'Erstellt einen neuen, unveröffentlichten Termin',
                id: 'event.AddButton.title'
            })}
        />
    );
});

const UsersEvents = observer((props: Props) => {
    const { user } = props;
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    const jobStore = useStore('jobStore');
    const viewStore = useStore('viewStore');
    const regPeriodStore = useStore('registrationPeriodStore');
    if (!user) {
        return null;
    }
    const drafts = viewStore.usersEvents({
        ignoreImported: true,
        ignoreDeleted: true,
        states: [EventState.Draft]
    });
    const reviewed = viewStore.usersEvents({
        ignoreImported: true,
        ignoreDeleted: true,
        states: [EventState.Review, EventState.Refused]
    });
    const adminReview = user?.isAdmin ? viewStore.allEvents({ states: [EventState.Review] }) : [];
    const published = viewStore.usersEvents({ ignoreImported: true, states: [EventState.Published] });
    const deleted = viewStore.usersEvents({ onlyDeleted: true });

    return (
        <div className="full-width">
            <Tabs lazy queryString groupId="events-tab">
                <TabItem
                    value="my-events"
                    label={translate({
                        message: 'Unveröffentlicht',
                        id: 'components.event.usersevents.index.tabitem.notpublished',
                        description: 'Text not published'
                    })}
                >
                    <div className={clsx(styles.card, 'card')}>
                        <div className={clsx('card__header')}>
                            <h3>
                                {translate({
                                    message: 'Unveröffentlicht',
                                    id: 'components.event.usersevents.index.header.notpublished',
                                    description: 'Th: not published'
                                })}
                            </h3>
                        </div>
                        <div className={clsx('card__body', styles.bulk)}>
                            <div className={clsx(styles.alert, 'alert', 'alert--secondary')} role="alert">
                                <h4>
                                    <Translate id="userEvents.regPeriod.alert.title">
                                        Eingabefenster
                                    </Translate>
                                </h4>
                                {regPeriodStore.registrationPeriods.map((regPeriod) => {
                                    return <RegPeriodBadge key={regPeriod.id} period={regPeriod} />;
                                })}
                            </div>
                        </div>
                        <EventsViewer
                            events={drafts}
                            gridConfig={{ columns: COLUMN_CONFIG }}
                            bulkActionConfig={{
                                className: styles.indent,
                                middleActions: [<AddEventButton key="action-m1" />],
                                rightActions: [
                                    <ChangeViewAction
                                        viewType={viewType}
                                        setViewType={setViewType}
                                        key="action-r1"
                                    />
                                ]
                            }}
                            type={viewType}
                        />
                    </div>
                </TabItem>
                {reviewed.length > 0 && (
                    <TabItem
                        value="reviewed"
                        label={translate({
                            message: 'Review',
                            id: 'components.event.usersevents.index.tabitem.reviewed',
                            description: 'Events reviewed'
                        })}
                    >
                        <div className={clsx(styles.card, 'card')}>
                            <div className={clsx('card__header')}>
                                <h3>
                                    {translate({
                                        message: 'Im Review',
                                        id: 'components.event.usersevents.index.header.reviewed',
                                        description: 'Events reviewed'
                                    })}
                                </h3>
                            </div>
                            <EventsViewer
                                events={reviewed}
                                gridConfig={{ columns: COLUMN_CONFIG }}
                                bulkActionConfig={{
                                    className: styles.indent,
                                    rightActions: [
                                        <ChangeViewAction
                                            viewType={viewType}
                                            setViewType={setViewType}
                                            key="action-r1"
                                        />
                                    ]
                                }}
                                type={viewType}
                            />
                        </div>
                    </TabItem>
                )}
                {adminReview.length > 0 && (
                    <TabItem
                        value="admin-review"
                        label={translate({
                            message: 'Admin',
                            id: 'components.event.usersevents.index.tabitem.admin',
                            description: 'Events admin'
                        })}
                    >
                        <ToReview user={user} />
                    </TabItem>
                )}
                {published.length > 0 && (
                    <TabItem
                        value="published"
                        label={translate({
                            message: 'Veröffentlicht',
                            id: 'components.event.usersevents.index.tabitem.published',
                            description: 'Events published'
                        })}
                    >
                        <div className={clsx(styles.card, 'card')}>
                            <div className={clsx('card__header')}>
                                <h3>
                                    {translate({
                                        message: 'Veröffentlicht',
                                        id: 'components.event.usersevents.index.header.published',
                                        description: 'Th : Events published'
                                    })}
                                </h3>
                            </div>
                            <EventsViewer
                                events={published}
                                gridConfig={{ columns: COLUMN_CONFIG }}
                                bulkActionConfig={{
                                    className: styles.indent,
                                    rightActions: [
                                        <ChangeViewAction
                                            viewType={viewType}
                                            setViewType={setViewType}
                                            key="action-r1"
                                        />
                                    ]
                                }}
                                type={viewType}
                            />
                        </div>
                    </TabItem>
                )}
                {deleted.length > 0 && (
                    <TabItem
                        value="deleted"
                        label={translate({
                            message: 'Gelöscht',
                            id: 'components.event.usersevents.index.tabitem.deleted',
                            description: 'Events deleted'
                        })}
                    >
                        <div className={clsx(styles.card, 'card')}>
                            <div className={clsx('card__header')}>
                                <h3>
                                    {translate({
                                        message: 'Gelöscht',
                                        id: 'components.event.usersevents.index.header.deleted',
                                        description: 'Th: Events deleted'
                                    })}
                                </h3>
                            </div>
                            <EventsViewer
                                events={deleted}
                                gridConfig={{ columns: COLUMN_CONFIG }}
                                bulkActionConfig={{
                                    className: styles.indent,
                                    rightActions: [
                                        <ChangeViewAction
                                            viewType={viewType}
                                            setViewType={setViewType}
                                            key="action-r1"
                                        />
                                    ]
                                }}
                                type={viewType}
                            />
                        </div>
                    </TabItem>
                )}
                {jobStore.importJobs.length > 0 && (
                    <TabItem value="import" label="Import">
                        <div className={clsx(styles.imports)}>
                            {jobStore.importJobs.map((job, idx) => {
                                const events = viewStore.allEvents({ jobId: job.id, orderBy: 'isValid-asc' });
                                return (
                                    <LazyDetails
                                        key={job.id}
                                        summary={
                                            <summary>
                                                {(job.user as User)?.email} - {job.filename || '|'} -{' '}
                                                {job.state} - {events.length} - {formatDate(job.createdAt)}
                                            </summary>
                                        }
                                    >
                                        <div className={clsx(styles.imported)}>
                                            <EventsViewer
                                                events={events}
                                                gridConfig={{
                                                    columns: ['nr', ...COLUMN_CONFIG],
                                                    className: clsx(styles.noMarginScrollContainer)
                                                }}
                                                bulkActionConfig={{
                                                    className: styles.indent,
                                                    rightActions: [
                                                        <Delete
                                                            onClick={() => {
                                                                jobStore.destroy(job);
                                                            }}
                                                            text={translate({
                                                                message: 'Job Löschen',
                                                                id: 'components.event.usersevents.index.delete',
                                                                description: 'Text to delete a job'
                                                            })}
                                                            flyoutSide="right"
                                                            iconSide="right"
                                                            size={SIZE}
                                                            apiState={jobStore.apiStateFor(
                                                                `destroy-${job.id}`
                                                            )}
                                                            key="action-r1"
                                                        />,
                                                        <ChangeViewAction
                                                            viewType={viewType}
                                                            setViewType={setViewType}
                                                            key="action-r2"
                                                        />
                                                    ]
                                                }}
                                                type={viewType}
                                            />
                                        </div>
                                    </LazyDetails>
                                );
                            })}
                        </div>
                    </TabItem>
                )}
            </Tabs>
        </div>
    );
});

export default UsersEvents;
