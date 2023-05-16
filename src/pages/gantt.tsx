import React from 'react';
import clsx from 'clsx';
import styles from './gantt.module.scss';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import EventModal from '../components/Event/Modal';

const GanttView = observer(() => {
    const viewStore = useStore('viewStore');
    const ref = React.useRef<HTMLDivElement>(null);
    const tasks: Task[] = (viewStore.semester?.events || []).filter((e) => e.isValid).map((e, idx) => {
        return {
            start: e.start,
            end: e.end,
            name: e.description,
            id: e.id || `id-${idx}`,
            type: 'task',
            progress: e.progress,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        }
    });

    React.useEffect(() => {
        const ts = setTimeout(() => {
            const today = document.querySelector('.today');
            if (today) {
                today.scrollIntoView();
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
            }
        }
    }, [ref.current]);
                
    return (
        <Layout>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.gantt)} ref={ref}>
                    {tasks.length > 0 && (
                        <Gantt
                            tasks={tasks}
                            viewMode={ViewMode.Day}
                            listCellWidth={''}
                            viewDate={new Date()}
                            rowHeight={20}
                            locale="gsw"
                            onClick={(task: Task) => {
                                viewStore.setEventModalId(task.id);
                            }}
                        />
                    )}
                </div>
            </div>
            <EventModal />
        </Layout>
    )
});

export default GanttView;