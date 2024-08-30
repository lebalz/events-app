import React, { useMemo } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';
import { default as EventModelView } from '@site/src/components/Event';
import _ from 'lodash';

interface Props {
    events: Event[];
}

const List = observer((props: Props) => {
    const events = useMemo(
        () => _.sortBy(props.events, ['startTimeMs']),
        [props.events, props.events.length]
    );
    const allSameParent =
        events.length > 1 &&
        events[0].hasParent &&
        events.every((event) => event.parentId === events[0]?.parentId);
    const allUnpublishedVersions = allSameParent && events[0].unpublishedVersions.length === events.length;

    return (
        <div className={clsx(styles.events)}>
            {props.events.map((event, idx) => {
                return (
                    <EventModelView
                        key={idx}
                        event={event}
                        className={clsx(styles.event)}
                        hideParent={allSameParent}
                        hideShowVersionsButton={allUnpublishedVersions}
                    />
                );
            })}
        </div>
    );
});

export default List;
