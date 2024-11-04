import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as EventModel } from '@site/src/models/Event';
import EventProps from './EventProps';
import ParentDetails from './ParentDetails';
interface Props {
    event: EventModel;
    inModal?: boolean;
    hideParent?: boolean;
    hideShowVersionsButton?: boolean;
    hideTitle?: boolean;
}

const EventBody = observer((props: Props) => {
    const [isOpen, setOpen] = React.useState(false);
    const { event, hideParent } = props;
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }, [ref]);

    return (
        <div
            className={clsx(
                styles.eventBody,
                event.hasParent,
                isOpen && styles.flex,
                event.hasParent && styles.splitView
            )}
        >
            <div ref={ref} />
            {/* scroll to top */}
            <EventProps
                {...props}
                showVersionHeader={event.hasParent}
                hideShowVersionsButton={props.hideShowVersionsButton}
                hideTitle={props.hideTitle}
            />
            {!hideParent && event.hasParent && (
                <ParentDetails event={event} inModal={props.inModal} onOpenChange={setOpen} />
            )}
        </div>
    );
});

export default EventBody;
