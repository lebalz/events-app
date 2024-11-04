import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import shared from '../styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { translate } from '@docusaurus/Translate';
import User from '@site/src/models/User';
import { EventState } from '@site/src/api/event';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import { COLUMN_CONFIG } from '..';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';

interface Props {
    user: User;
}

const ToReview = observer((props: Props) => {
    const [viewType, setViewType] = React.useState<View>(View.Grid);
    const { user } = props;
    const viewStore = useStore('viewStore');
    const adminReview = user?.isAdmin ? viewStore.allEvents({ states: [EventState.Review] }) : [];
    return (
        <div className={clsx(shared.card, 'card')}>
            <div className={clsx('card__header')}>
                <h3>
                    {translate({
                        message: 'Review Anfragen für Admins',
                        id: 'components.event.usersevents.index.header.admin',
                        description: 'Events admin'
                    })}
                </h3>
            </div>
            <EventsViewer
                events={adminReview}
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

export default ToReview;
