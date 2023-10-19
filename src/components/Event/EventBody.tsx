import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { useHistory } from "@docusaurus/router";
import EventProps from './EventProps';
interface Props {
    event: EventModel;
    inModal?: boolean;
}

const EventBody = observer((props: Props) => {
    const { event } = props;
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const history = useHistory();
    const commonClasses = clsx(event.isDeleted && styles.deleted);
    const commonProps = { event, styles, className: commonClasses };
    const commonEditProps = { ...commonProps, isEditable: true };
    const [showOptions, setShowOptions] = React.useState(false);

    return (
        <div className={clsx(styles.eventBody, event.hasParent && styles.splitView)}>
            {event.hasParent && (
                <EventProps event={event.publishedParent} inModal={props.inModal} showVersionHeader/>
            )}
            <EventProps {...props} showVersionHeader={event.hasParent} />
        </div>
    )
});

export default EventBody;