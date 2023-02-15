import { Departements } from '@site/src/api/event';
import SchoolEvent from '@site/src/models/SchoolEvent';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ToggleFilter from '../shared/ToggleFilter';
import styles from './EventList.module.scss';
import EventRow from './EventRow';
import Icon from '@mdi/react';
import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { reaction } from 'mobx';
import FullScreenButton from '../shared/FullScreenButton';

interface Props {
    events: SchoolEvent[];
    showFullscreenButton?: boolean;
}

const EventList = observer((props: Props) => {
    // const {isSticky, tableRef} = useStickyHeader();
    const eventStore = useStore('eventStore');
    const viewStore = useStore('viewStore');
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        const current = viewStore.fullscreen;
        if (props.showFullscreenButton) {
            viewStore.setShowFullscreenButton(true);
        }
        return () => viewStore.setShowFullscreenButton(current);
    }, []);

    React.useEffect(
        () =>
            reaction(
                () => viewStore.fullscreen,
                (fullscreen) => {
                    if (fullscreen) {
                        containerRef.current?.requestFullscreen();
                    } else if (document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                    console.log('fullscreen', viewStore.fullscreen);
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

    const onChange = (event: any, id: string) => {
        const param: any = {};
        param[event.target.name] = event.target.value;
        eventStore.updateEvent(id, param);
    };
    const userStore = useStore('userStore');
    const userId = userStore.current?.id;

    return (
        <div className={clsx(styles.container)} ref={containerRef}>
            {viewStore.fullscreen && (
                <div className={clsx(styles.navbar)}>
                    <div className={clsx(styles.button)}>
                        <FullScreenButton />
                    </div>
                </div>
            )}
            <div className={clsx(styles.scrollContainer, viewStore.fullscreen && styles.fullscreen)}>
                <table className={clsx(styles.table)}>
                    <thead>
                        <tr>
                            <th>KW</th>
                            <th>Wochentag</th>
                            <th>Stichwort</th>
                            <th>Start</th>
                            <th>Ende</th>
                            <th>Ort</th>
                            <th>
                                <div>
                                    Schulen
                                </div>
                                {
                                    <ToggleFilter
                                        values={Object.values(Departements).map((key) => ({
                                            value: key,
                                            active: viewStore.eventTable.departments.has(key),
                                            color: `var(--${key.toLowerCase()})`
                                        }))}
                                        onChange={(value) => {
                                            if (viewStore.eventTable.departments.has(value)) {
                                                viewStore.eventTable.departments.delete(value);
                                            } else {
                                                viewStore.eventTable.departments.add(value);
                                            }
                                        }}
                                    />
                                }
                            </th>
                            <th>Klassen</th>
                            <th>Beschreibung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.events.map((event) => (<EventRow key={event.id} event={event} onChange={onChange} locked={event.authorId !== userId} />))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default EventList;