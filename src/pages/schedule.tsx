import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

moment.locale('de-CH');
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment)

const Schedule = observer(() => {
    const userStore = useStore('userStore');
    const monday = moment().utc().startOf("isoWeek");
    const lessons = (userStore.current?.untisTeacher?.lessons || []).map((l, idx) => {
        const start = monday.clone().add(l.start_time, 'milliseconds').subtract(moment().utcOffset(), 'minutes').toDate();
        const ende = monday.clone().add(l.end_time, 'milliseconds').subtract(moment().utcOffset(), 'minutes').toDate();
        return {
          start: start,
          end: ende,
          title: `${l.subjectName}:${l.classes.map(c => c.name).join(', ')}`,
          description: l.subjectName,
          id: l.id
        }
    });
    return (
        <div>
            {lessons.length > 0 && (
                <BigCalendar
                    defaultView='week'
                    defaultDate={moment().toDate()}
                    localizer={localizer}
                    events={lessons}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 1700 }}
                    popup
                    selectable

              />
            )}
        </div>
    )
});

export default Schedule;