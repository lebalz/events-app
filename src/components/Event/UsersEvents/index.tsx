import React from 'react';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '@site/src/stores/hooks';
import User from '@site/src/models/User';
import { ColumnConfig } from '../Views/Grid';
import { translate } from '@docusaurus/Translate';
import { View } from '../../EventsViewer';
import InReviewTab from './InReviewTab';
import DraftTab from './DraftTab';
import ToReviewTab from './ToReviewTab';
import PublishedTab from './PublishedTab';
import DeletedTab from './DeletedTab';
import JobTab from './JobTab';
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

export const COLUMN_CONFIG_ADMIN: ColumnConfig = [
    ...COLUMN_CONFIG.slice(0, 3),
    'author',
    ...COLUMN_CONFIG.slice(3)
];
interface Props {
    user: User;
}

const UsersEvents = observer((props: Props) => {
    const { user } = props;
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    const jobStore = useStore('jobStore');
    if (!user) {
        return null;
    }

    return (
        <div>
            <Tabs lazy queryString groupId="events-tab" className="full-width">
                <TabItem
                    value="my-events"
                    label={translate({
                        message: 'Entwürfe',
                        id: 'components.event.usersevents.index.tabitem.notpublished',
                        description: 'Text not published'
                    })}
                >
                    <DraftTab viewType={viewType} onChangeView={setViewType} />
                </TabItem>
                <TabItem
                    value="reviewed"
                    label={translate({
                        message: 'Review',
                        id: 'components.event.usersevents.index.tabitem.reviewed',
                        description: 'Events reviewed'
                    })}
                >
                    <InReviewTab viewType={viewType} onChangeView={setViewType} />
                </TabItem>
                {user.isAdmin && (
                    <TabItem
                        value="admin-review"
                        label={translate({
                            message: 'Admin',
                            id: 'components.event.usersevents.index.tabitem.admin',
                            description: 'Events admin'
                        })}
                    >
                        <ToReviewTab />
                    </TabItem>
                )}
                <TabItem
                    value="published"
                    label={translate({
                        message: 'Veröffentlicht',
                        id: 'components.event.usersevents.index.tabitem.published',
                        description: 'Events published'
                    })}
                >
                    <PublishedTab viewType={viewType} onChangeView={setViewType} />
                </TabItem>
                <TabItem
                    value="deleted"
                    label={translate({
                        message: 'Gelöscht',
                        id: 'components.event.usersevents.index.tabitem.deleted',
                        description: 'Events deleted'
                    })}
                >
                    <DeletedTab viewType={viewType} onChangeView={setViewType} />
                </TabItem>
                {jobStore.importJobs.length > 0 && (
                    <TabItem value="import" label="Import">
                        <JobTab viewType={viewType} onChangeView={setViewType} />
                    </TabItem>
                )}
            </Tabs>
        </div>
    );
});

export default UsersEvents;
