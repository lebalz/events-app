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

interface Props {
    events: SchoolEvent[];
}

const EventList = observer((props: Props) => {
    // const {isSticky, tableRef} = useStickyHeader();
    const eventStore = useStore('eventStore');
    const viewStore = useStore('viewStore');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Watch for fullscreenchange
    React.useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
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
        <div className={clsx(styles.container)}>
            <div className={clsx(styles.fullscreenButton)} onClick={() => {
                if (containerRef.current) {
                    try {
                        if (isFullscreen) {
                            document.exitFullscreen();
                        } else {
                            const fn = containerRef.current.requestFullscreen;
                            if (fn) {
                                fn.call(containerRef.current);
                            }
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }}>
                <Icon path={isFullscreen ? mdiFullscreenExit : mdiFullscreen} size={1} />
            </div>
            <div className={clsx(styles.scrollContainer)} ref={containerRef}>
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