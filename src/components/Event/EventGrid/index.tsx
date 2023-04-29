import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Event from './Event';
import {default as EventModel} from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import EventHeader from './EventHeader';
import { action, reaction } from 'mobx';
import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import { mdiCalendar, mdiCalendarMonth } from '@mdi/js';
import { Icon, SIZE } from '../../shared/icons';
import Filter from '../Filter';


interface Props {
    events: EventModel[];
    showFullscreenButton?: boolean;
    selectable?: boolean;
    showAuthor?: boolean;
}

const EventGrid = observer((props: Props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const viewStore = useStore('viewStore');

    React.useEffect(() => {
        const current = viewStore.fullscreen;
        viewStore.setShowFullscreenButton(props.showFullscreenButton ?? true);
        return () => viewStore.setShowFullscreenButton(current);
    }, []);
    
    React.useEffect(
        () =>
            reaction(
                () => viewStore.fullscreen,
                (fullscreen) => {
                    if (fullscreen) {
                        ref.current?.requestFullscreen();
                    } else if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                }
            ),
        []
    );
    // Watch for fullscreenchange
    React.useEffect(() => {
        const onFullscreenChange = () => {
            if (!!document.fullscreenElement !== viewStore.fullscreen) {
                viewStore.setFullscreen(!!document.fullscreenElement);
            }
        }
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    const hasEdits = props.events.some((e) => e.editing);
    return (
        <div className={clsx(styles.scroll, 'event-grid')} ref={ref}>
            <Filter />
            <div className={clsx(styles.grid, props.selectable && styles.selectable, props.showAuthor && styles.showAuthor)}>
                <EventHeader 
                    onSelectAll={props.selectable ? action((v) => props.events.forEach(e => e.setSelected(v))) : undefined}
                    checked={props.events.every(e => e.selected)} 
                    partialChecked={props.events.some(e => e.selected)}
                />
                {props.events.map((event, idx) => (
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
                ))}
                {hasEdits && (
                    <div className={clsx(styles.spacerBottom)} style={{gridColumnStart: 'kw', gridColumnEnd: 'gridEnd'}}>
                        <Button
                            icon={<Icon path={mdiCalendarMonth} size={2} color="primary" />}
                            text="Events"
                            disabled
                            size={SIZE}
                            iconSide='left'
                        />
                    </div>
                )}
            </div>
        </div>
    )
});

export default EventGrid;