import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import { getKW } from '@site/src/models/helpers/time';
import Event from './Event';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useOnScreen, useStore } from '@site/src/stores/hooks';
import { action } from 'mobx';


interface Props {
    id: string;
    kw: number;
    content?: string | React.ReactNode;
    events: EventModel[];
    selectable?: boolean;
    className?: string;
}

const CURRENT_KW = getKW(new Date());

const EventGroup = observer((props: Props) => {
    const [expanded, setExpanded] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const onScreen = useOnScreen(ref, '.event-grid', "0% 30px 0% 30px");
    const viewStore = useStore('viewStore');
    React.useEffect(() => {
        if (onScreen) {
            setExpanded(true);
        }
    }, [onScreen]);
    const isCurrentWeek = props.kw === CURRENT_KW;
    return (
        <>
            <div 
                className={clsx(styles.eventGroup, props.className,  viewStore.eventTable.activeGroup === props.id && styles.active, isCurrentWeek && styles.currentWeek)} 
                style={{ height: expanded ? undefined : `${props.events.length * 35}px`,  gridColumnStart: 'gridStart', gridColumnEnd: 'gridEnd' }}
                ref={ref}
                id={clsx(isCurrentWeek && 'current-week')}
                onClick={() => {
                    if (viewStore.eventTable.activeGroup) {
                        viewStore.eventTable.setActiveGroup(null);
                        setTimeout(() => {
                                if (ref.current) {
                                    ref.current.scrollIntoView({
                                        block: 'start'
                                    });
                                    setTimeout(() => {
                                        console.log('now im in')
                                        window.scrollTo({top: 0, behavior: 'smooth'});
                                    }, 2300);
                                }
                            }, 0);
                    } else {
                        viewStore.eventTable.setActiveGroup(props.id)
                    }
                }}
            >
                {props.content}
            </div>
            {expanded && (
                props.events.map((event, idx) => (
                    <Event
                        styles={styles}
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
