import React from 'react';
import { observer } from 'mobx-react-lite';
import TabItem from '@theme/TabItem';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import shared from '../../styles.module.scss';
import { COLUMN_CONFIG_ADMIN } from '..';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import NoEventsAlert from '../NoEventsAlert';
interface Props {
    viewType: View;
    onChangeView: (view: View) => void;
}

const InReviewTab = observer((props: Props) => {
    const { viewType } = props;
    const viewStore = useStore('viewStore');
    const events = viewStore.inReviewEvents;
    const label = translate({
        message: 'Im Review',
        id: 'components.event.usersevents.index.header.reviewed',
        description: 'Events reviewed'
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
                events={viewStore.inReviewEvents}
                gridConfig={{ columns: COLUMN_CONFIG_ADMIN }}
                bulkActionConfig={{
                    className: shared.indent,
                    rightActions: [
                        <ChangeViewAction
                            viewType={viewType}
                            setViewType={props.onChangeView}
                            key="action-r1"
                        />
                    ]
                }}
                type={viewType}
            />
        </div>
    );
});

export default InReviewTab;
