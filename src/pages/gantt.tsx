import React from 'react';
import clsx from 'clsx';
import styles from './gantt.module.scss';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import Filter from '../components/Event/Filter';
import { createTransformer } from 'mobx-utils';
import Event from '../models/Event';
import siteConfig from '@generated/docusaurus.config';
const { CURRENT_LOCALE } = siteConfig.customFields as { CURRENT_LOCALE?: 'de' | 'fr' };

const ISO_639_CODES = {
    de: 'gsw',
    fr: 'fr'
}

const createTasks = createTransformer<Event[], Task[]>((events: Event[]) => {
    return events.map((e, idx) => {
        const styles = { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' } as any;
        if (e.isDeleted) {
            styles.progressColor = '#ff0000';
            styles.progressSelectedColor = '#830000';
            styles.backgroundSelectedColor = '#830000';
            styles.backgroundColor = '#ff0000';
        }
        return {
            start: e.start,
            end: e.end,
            name: `${e.isDeleted ? '❌: ' : ''}${e.description}`,
            id: e.id || `id-${idx}`,
            type: 'task',
            progress: e.progress,
            isDisabled: true,
            styles: styles,
        }
    });
});

const GanttView = observer(() => {
    const viewStore = useStore('viewStore');
    const { eventTable } = viewStore;
    const ref = React.useRef<HTMLDivElement>(null);
    const [timer, setTimer] = React.useState<number>(0);
    const tasks = createTasks(eventTable.events);
    React.useEffect(() => {
        const ts = setTimeout(() => {
            const today = document.querySelector('.today');
            if (today) {
                today.scrollIntoView();
                window.scrollTo(0, 0);
            }
        }, 20);
        return () => clearTimeout(ts);
    }, [tasks]);

    /**
     * gantt-task-react handles (and prevents sometimes) horizontal scrolling with the mouse wheel.
     * This is a workaround to enable horizontal scrolling.
     * It depends on the order of event handlers, that the last added handlers will process first. If this changes,
     * this workaround wont work anymore.
     */
    React.useEffect(() => {
        const gantt = ref.current;
        if (gantt) {
            const children = gantt.querySelectorAll('div');
            if (children.length > 1) {
                /** the second div is the one that blocks the wheel event */
                const wheelBlocker = children[1];
                const onWheel = (e: WheelEvent) => {
                    /** stops propagation to other handlers on this element, 
                     * but does not stop propagation/bubbling  */
                    e.stopImmediatePropagation();
                }
                wheelBlocker.addEventListener('wheel', onWheel);
                return () => wheelBlocker.removeEventListener('wheel', onWheel);
            } else if (timer < 50) {
                /** page was freshly loaded and the wheel-handling div was not found - check again in some milliseconds */
                const ts = setTimeout(() => {
                    setTimer(timer + 1);
                }, 200);
                return () => clearTimeout(ts);
            } else {
                console.warn('Could not find the wheel-blocking div in the gantt component. Sidescrolling might not work.')
            }
        }
    }, [ref.current, timer]);
                
    return (
        <Layout>
            <Filter showCurrentAndFuture />
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.gantt)} ref={ref}>
                    {tasks.length > 0 && (
                        <Gantt
                            tasks={tasks}
                            viewMode={ViewMode.Day}
                            listCellWidth={''}
                            viewDate={new Date()}
                            rowHeight={20}
                            locale={ISO_639_CODES[CURRENT_LOCALE || 'de']}
                            onClick={(task: Task) => {
                                viewStore.setEventModalId(task.id);
                            }}
                        />
                    )}
                </div>
            </div>
        </Layout>
    )
});

export default GanttView;