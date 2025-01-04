import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import shared from '../../styles.module.scss';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import { COLUMN_CONFIG } from '..';
import NoEventsAlert from '../NoEventsAlert';
interface Props {
    viewType: View;
    onChangeView: (view: View) => void;
}

const DeletedTab = observer((props: Props) => {
    const { viewType } = props;
    const viewStore = useStore('viewStore');
    const events = viewStore.usersEvents({ onlyDeleted: true });

    const label = translate({
        message: 'Gelöscht',
        id: 'components.event.usersevents.index.header.deleted',
        description: 'Th: Events deleted'
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

export default DeletedTab;
