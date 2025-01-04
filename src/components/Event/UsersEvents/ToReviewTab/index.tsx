import React from 'react';
import clsx from 'clsx';

import shared from '../../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { translate } from '@docusaurus/Translate';
import User from '@site/src/models/User';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import { COLUMN_CONFIG } from '..';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import NoEventsAlert from '../NoEventsAlert';

interface Props {}

const ToReviewTab = observer((props: Props) => {
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    const viewStore = useStore('viewStore');

    const events = viewStore.adminReviewEvents;
    const label = translate({
        message: 'Review Anfragen für Admins',
        id: 'components.event.usersevents.index.header.admin',
        description: 'Events admin'
    });
    if (events.length === 0) {
        return <NoEventsAlert category={label} />;
    }
    return (
        <div className={clsx(shared.card, 'card')}>
            <div className={clsx('card__header')}>
                <h3>{label}</h3>
            </div>
            <EventsViewer
                events={events}
                gridConfig={{ columns: ['author', ...COLUMN_CONFIG] }}
                bulkActionConfig={{
                    className: shared.indent,
                    rightActions: [
                        <ChangeViewAction viewType={viewType} setViewType={setViewType} key="action-r1" />
                    ]
                }}
                type={viewType}
            />
        </div>
    );
});

export default ToReviewTab;
