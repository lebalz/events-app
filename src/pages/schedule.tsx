import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

moment.locale('de-CH');
import "react-big-calendar/lib/css/react-big-calendar.css";
import Layout from '@theme/Layout';
const localizer = momentLocalizer(moment)

const Schedule = observer(() => {
    const userStore = useStore('userStore');
    const lessons = (userStore.current?.untisTeacher?.lessons || []).map((l, idx) => {
        return {
            start: l.startTime,
            end: l.endTime,
            title: `${l.subjectName}:${l.classes.map(c => c.name).join(', ')}`,
            description: l.subjectName,
            id: l.id
        }
    });
    return (
        <Layout>
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
        </Layout>
    )
});

export default Schedule;