import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Event from './Event';
import {default as EventModel} from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import EventHeader from './EventHeader';
import { reaction } from 'mobx';
import FullScreenButton from '../../shared/FullScreenButton';


interface Props {
    events: EventModel[];
}

const EventGrid = observer((props: Props) => {
    // const [height, setHeight] = React.useState(0);
    // const [startIdx, setStartIdx] = React.useState(0);
    // const [endIdx, setEndIdx] = React.useState(30);
    // const [ref, setRef] = React.useState<HTMLDivElement>(null);
    const ref = React.useRef<HTMLDivElement>(null);
    // const [scrollLeft, setScrollLeft] = React.useState(0);
    // const [scrollTop, setScrollTop] = React.useState(0);
    const [hiddenActions, setHiddenActions] = React.useState(false);
    const viewStore = useStore('viewStore');
    // React.useEffect(() => {
    //     const onScroll = (e) => {
    //         const container = e.target as HTMLElement;
    //         const left = container.scrollLeft;
    //         const top = container.scrollTop;
    //         const bottom = top + height;
    //         let idx = 0;
    //         let totalHeight = 0;
    //         const kws = container.querySelectorAll('.kw');
    //         while (idx < kws.length && totalHeight < bottom) {
    //             totalHeight += kws.item(idx).clientHeight;
    //             idx += 1;
    //         }
    //         setEndIdx(idx + 5);
    //         if (left > scrollLeft && !hiddenActions) {
    //             setHiddenActions(true);
    //         } else if (left < scrollLeft && hiddenActions) {
    //             setHiddenActions(false);
    //         }
    //         // console.log(top, height);
    //         setScrollLeft(left);
    //         setScrollTop(top);
    //     }
    //     if (ref.current) {
    //         ref.current.addEventListener('scroll', onScroll);
    //         return () => {
    //             if (ref.current) {
    //                 ref.current.removeEventListener('scroll', onScroll);
    //                 const ch = ref.current.getBoundingClientRect();
    //                 setHeight(ch.height);
    //             }
    //         }
    //     }
    // }, [ref.current, scrollLeft, hiddenActions, height]);

    /**
     * Handle Resize
     */
    React.useEffect(() => {
        const onResize = () => {
            if (ref.current){
                viewStore.eventTable.setClientWidth(ref.current.clientWidth);
                /* get the current font size in pixels */
                const px = parseFloat(getComputedStyle(ref.current).fontSize);
                viewStore.eventTable.setBaseFontSize(px);
            }
        }
        if (ref.current){
            window.addEventListener('resize', onResize);
            onResize();
        }
        return () => window.removeEventListener('resize', onResize);
    }, [ref, viewStore]);

    React.useEffect(() => {
        const current = viewStore.fullscreen;
        viewStore.setShowFullscreenButton(true);
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
    return (
        <div className={clsx(styles.scroll)} ref={ref}>
            <div className={clsx(styles.grid)}>
                <EventHeader hideActions={hiddenActions}/>
                {props.events.map((event, idx) => (
                    <Event key={event.id} rowIndex={idx} event={event} hideActions={hiddenActions} show={true} />
                ))}
            </div>
        </div>
    )
});

export default EventGrid;