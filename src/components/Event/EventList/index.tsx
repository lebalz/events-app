import Event from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './styles.module.scss';
import EventRow from './EventRow';
import { reaction } from 'mobx';
import FullScreenButton from '../../shared/FullScreenButton';
import EditRow from './EditRow';

interface Props {
    events: Event[];
    showFullscreenButton?: boolean;
}

const EventList = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const containerRef = React.useRef<HTMLDivElement>(null);
    
    React.useEffect(() => {
        const current = viewStore.fullscreen;
        if (props.showFullscreenButton) {
            viewStore.setShowFullscreenButton(true);
        }
        return () => viewStore.setShowFullscreenButton(current);
    }, []);

    /**
     * Handle Resize
     */
    React.useEffect(() => {
        const onResize = () => {
            if (containerRef.current){
                viewStore.eventTable.setClientWidth(containerRef.current.clientWidth);
                /* get the current font size in pixels */
                const px = parseFloat(getComputedStyle(containerRef.current).fontSize);
                viewStore.eventTable.setBaseFontSize(px);
            }
        }
        if (containerRef.current){
            window.addEventListener('resize', onResize);
            onResize();
        }
        return () => window.removeEventListener('resize', onResize);
    }, [containerRef, viewStore]);

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

    const userStore = useStore('userStore');
    const userId = userStore.current?.id;
    const isEdited = props.events.some((e) => e.editing);

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
                        <tr className={clsx(isEdited && styles.editMode)}>
                            <th>KW</th>
                            <th>Tag</th>
                            <th>Stichwort</th>
                            <th>Start</th>
                            <th>Zeit</th>
                            <th>Ende</th>
                            <th>Zeit</th>
                            <th>Ort</th>
                            <th>Schulen</th>
                            <th>Klassen</th>
                            <th>Beschreibung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.events.map((event) => {
                            if (event.editing) {
                                return <EditRow key={event.id} event={event} locked={event.authorId !== userId} />;
                            }
                            return <EventRow key={event.id} event={event} locked={event.authorId !== userId} editMode={isEdited} />;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default EventList;