import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Event from './Event';
import {default as EventModel} from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import EventHeader from './EventHeader';


interface Props {
    events: EventModel[];
}

const EventGrid = observer((props: Props) => {
    const [ref, setRef] = React.useState<HTMLDivElement>(null);
    const [scrollLeft, setScrollLeft] = React.useState(0);
    const [hiddenActions, setHiddenActions] = React.useState(false);
    React.useEffect(() => {
        const onScroll = (e) => {
            const container = e.target as HTMLElement;
            const left = container.scrollLeft;
            if (left > scrollLeft && !hiddenActions) {
                setHiddenActions(true);
            } else if (left < scrollLeft && hiddenActions) {
                setHiddenActions(false);
            }
            setScrollLeft(left);
        }
        if (ref) {
            ref.addEventListener('scroll', onScroll);
            return () => {
                if (ref) {
                    ref.removeEventListener('scroll', onScroll);
                }
            }
        }
    }, [ref, scrollLeft, hiddenActions]);

    return (
        <div className={clsx(styles.scroll)} ref={setRef}>
            <div className={clsx(styles.grid)}>
                <EventHeader hideActions={hiddenActions}/>
                {props.events.map((event, idx) => (
                    <Event key={event.id} rowIndex={idx} event={event} hideActions={hiddenActions} />
                ))}
            </div>
        </div>
    )
});

export default EventGrid;