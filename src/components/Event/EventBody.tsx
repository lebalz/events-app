import clsx from 'clsx';
import React from 'react';

import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import EventOverviewSmall from '../EventOverviewSmall';
import EventProps from './EventProps';
import ParentDetails from './ParentDetails';
import styles from './styles.module.scss';
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
    const eventStore = useStore('eventStore');
    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }, [ref]);
    React.useEffect(() => {
        const disposer = reaction(
            () => event.hasParent && !event.parent,
            (loadParent) => {
                if (loadParent && event.parentId) {
                    eventStore.loadModel(event.parentId);
                }
            }
        );
        return () => disposer();
    }, []);

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
                <>
                    {event.parent && (
                        <div className={clsx(styles.eventComparison)}>
                            <EventOverviewSmall event={event} compareWith={event.parent} showState />
                            <EventOverviewSmall event={event.parent} compareWith={event} showState />
                        </div>
                    )}
                    <ParentDetails event={event} inModal={props.inModal} onOpenChange={setOpen} />
                </>
            )}
        </div>
    );
});

export default EventBody;
