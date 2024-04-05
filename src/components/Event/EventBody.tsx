import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import EventProps from './EventProps';
interface Props {
    event: EventModel;
    inModal?: boolean;
    hideParent?: boolean;
}

const EventBody = observer((props: Props) => {
    const { event, hideParent } = props;

    return (
        <div className={clsx(styles.eventBody, event.hasParent && styles.splitView)}>
            {!hideParent && event.hasParent && (
                <EventProps event={event.publishedParent} inModal={props.inModal} showVersionHeader/>
            )}
            <EventProps {...props} showVersionHeader={event.hasParent} />
        </div>
    )
});

export default EventBody;