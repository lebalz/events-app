import React from 'react';
import clsx from 'clsx';

import shared from '../../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { translate } from '@docusaurus/Translate';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import { COLUMN_CONFIG } from '..';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import NoEventsAlert from '../NoEventsAlert';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ShowDeletedAction from '@site/src/components/EventsViewer/ShowDeletedAction';

interface Props {}

const ToReviewTab = observer((props: Props) => {
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    const viewStore = useStore('viewStore');

    const events = viewStore.adminReviewEvents;
    const rejectedEvents = viewStore.adminRejectedEvents;
    if (events.length === 0 && rejectedEvents.length === 0) {
        const label = translate({
            message: 'Review Anfragen für Admins',
            id: 'components.event.usersevents.index.header.admin',
            description: 'Events admin'
        });
        return <NoEventsAlert category={label} />;
    }
    return (
        <div className={clsx(shared.card, 'card')}>
            <Tabs lazy queryString groupId="events-tab" className="full-width">
                <TabItem
                    value="pending"
                    default
                    label={translate({
                        message: 'Pendente Anfragen',
                        id: 'components.event.usersevents.index.tabitem.toreview'
                    })}
                >
                    <EventsViewer
                        events={events}
                        gridConfig={{ columns: ['author', ...COLUMN_CONFIG] }}
                        bulkActionConfig={{
                            className: shared.indent,
                            leftActions: [<ShowDeletedAction key="action-l1" />],
                            rightActions: [
                                <ChangeViewAction
                                    viewType={viewType}
                                    setViewType={setViewType}
                                    key="action-r1"
                                />
                            ],
                            hideRecallAction: true
                        }}
                        type={viewType}
                    />
                </TabItem>
                <TabItem
                    value="recjected"
                    label={translate({
                        message: 'Zurückgewiesene Anfragen',
                        id: 'components.event.usersevents.index.tabitem.rejected'
                    })}
                >
                    <EventsViewer
                        events={rejectedEvents}
                        gridConfig={{ columns: ['author', ...COLUMN_CONFIG] }}
                        bulkActionConfig={{
                            className: shared.indent,
                            leftActions: [<ShowDeletedAction key="action-l1" />],
                            rightActions: [
                                <ChangeViewAction
                                    viewType={viewType}
                                    setViewType={setViewType}
                                    key="action-r1"
                                />
                            ],
                            hideRecallAction: true
                        }}
                        type={viewType}
                    />
                </TabItem>
            </Tabs>
        </div>
    );
});

export default ToReviewTab;
