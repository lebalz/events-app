import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import Event from './Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useOnScreen, useStore } from '@site/src/stores/hooks';
import { action } from 'mobx';


interface Props {
    title?: string;
    events: EventModel[];
    selectable?: boolean;
    className?: string;
}

const EventGroup = observer((props: Props) => {
    const [expanded, setExpanded] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const onScreen = useOnScreen(ref, '.event-grid', "0% -300px 0% -300px");
    React.useEffect(() => {
        if (onScreen) {
            setExpanded(true);
        }
    }, [onScreen]);
    // React.useEffect(() => {
    //     if (ref.current &&!expanded) {
    //         const bb = ref.current.getBoundingClientRect();
    //         if (bb.top >= 0 && bb.bottom <= document.documentElement.clientHeight) {
    //             setExpanded(true);
    //         } else {
    //             const onScroll = () => {
    //                 const bb = ref.current!.getBoundingClientRect();
    //                 if (bb.top >= 0 && bb.bottom <= document.documentElement.clientHeight) {
    //                     setExpanded(true);
    //                     window.removeEventListener('scroll', onScroll);
    //                 }
    //             }
    //             window.addEventListener('scroll', onScroll);
    //             return () => window.removeEventListener('scroll', onScroll);
    //         }
    //     }
    // }, [ref.current, expanded]);
    return (
        <>
            <div 
                className={clsx(styles.eventGroup, props.className)} 
                style={{ gridColumnStart: 'gridStart', gridColumnEnd: 'gridEnd' }}
                ref={ref}
            >
                {props.title}
            </div>
            {expanded && (
                props.events.map((event, idx) => (
                    <Event
                        key={event.id}
                        rowIndex={idx}
                        event={event}
                        onSelect={props.selectable ?
                            action((selected: boolean, shiftKey: boolean) => {
                                if (shiftKey) {
                                    const topIdx = props.events.slice(0, idx).findLastIndex(e => e.selected);
                                    if (topIdx > -1) {
                                        props.events.slice(topIdx, idx).forEach(e => e.setSelected(selected));
                                    }
                                }
                                event.setSelected(selected);
                            }) : undefined
                        }
                    />
                ))
            )}
        </>
    )
});

export default EventGroup;