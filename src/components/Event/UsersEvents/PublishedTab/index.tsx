import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import shared from '../../styles.module.scss';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import { EventState } from '@site/src/api/event';
import { COLUMN_CONFIG } from '..';
import NoEventsAlert from '../NoEventsAlert';
interface Props {
    viewType: View;
    onChangeView: (view: View) => void;
}

const PublishedTab = observer((props: Props) => {
    const { viewType } = props;
    const viewStore = useStore('viewStore');

    const events = viewStore.usersEvents({ ignoreImported: true, states: [EventState.Published] });
    const label = translate({
        message: 'Veröffentlicht',
        id: 'components.event.usersevents.index.header.published',
        description: 'Th : Events published'
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
                gridConfig={{ columns: COLUMN_CONFIG }}
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

export default PublishedTab;
