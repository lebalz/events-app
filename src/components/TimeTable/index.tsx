import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

moment.locale('de-CH');
import "react-big-calendar/lib/css/react-big-calendar.css";
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Klass from '@site/src/models/Untis/Klass';
import { DAYS } from '@site/src/models/helpers/time';


const localizer = momentLocalizer(moment)
interface Props {
}

const TimeTable = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const untisStore = useStore('untisStore');

    const lessons = React.useMemo(() => {
        const lsns = (viewStore.usersLessons || []).filter(l => l.isFirstSuccessiveLesson).map((l, idx) => {
            const klGroups = Klass.ClassNamesGroupedByYear(l.classes);
            const kl = Object.values(klGroups).join(', ');
            const lastLesson = l.lastSuccessiveLesson ?? l;
            return {
                start: l.start,
                end: lastLesson.end,
                title: `${l.subject}: ${kl}`,
                description: l.subject,
                id: l.id
            }
        });
        return lsns;
    }, [viewStore.usersLessons]);

    return (
        <div className={clsx(styles.timeTable)}>
            {lessons.length > 0 && (
                <BigCalendar
                    defaultView='work_week'
                    toolbar={false}
                    views={['work_week']}
                    defaultDate={new Date()}
                    formats={{dayFormat: (date: Date) => `${DAYS[date.getDay()]}.`}}
                    localizer={localizer}
                    events={lessons}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    showMultiDayTimes
                    popup
                    selectable
                    onSelectEvent={({ id }) => {
                        console.log(untisStore.findLesson(id)?.props);
                    }}
                    min={new Date(2023, 0, 1, 7, 0, 0)}
                    max={new Date(2023, 0, 1, 18, 0, 0)}
                />
            )}
        </div>
    )
});

export default TimeTable;