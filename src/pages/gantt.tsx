import React from 'react';
import clsx from 'clsx';
import styles from './gantt.module.scss';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';

const GanttView = observer(() => {
    const viewStore = useStore('viewStore');
    const tasks: Task[] = (viewStore.semester?.events || []).filter((e) => !e.invalid).map((e, idx) => {
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
    return (
        <Layout>
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.gantt)}>
                    {tasks.length > 0 && (
                        <Gantt
                            tasks={tasks}
                            viewMode={ViewMode.Day}
                            listCellWidth={''}
                            viewDate={new Date()}
                            rowHeight={20}
                            locale="gsw"
                        />
                    )}
                </div>
            </div>
        </Layout>
    )
});

export default GanttView;