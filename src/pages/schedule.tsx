import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

moment.locale('de-CH');
import "react-big-calendar/lib/css/react-big-calendar.css";
import Layout from '@theme/Layout';
const localizer = momentLocalizer(moment)

const Schedule = observer(() => {
    const viewStore = useStore('viewStore');
    const untisStore = useStore('untisStore');
    const lessons = (viewStore.usersLessons || []).map((l, idx) => {
        return {
            start: l.start,
            end: l.end,
            title: `${l.subject}:${l.classes.map(c => c?.name).join(', ')}`,
            description: l.subject,
            id: l.id
        }
    });
    return (
        <Layout>
            <div>
                <h2>Stundenplan</h2>
                {lessons.length > 0 && (
                    <BigCalendar
                        defaultView='week'
                        toolbar={false}
                        views={['week']}
                        defaultDate={(new Date()).toISOString().slice(0, 10)}
                        localizer={localizer}
                        events={lessons}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 600 }}
                        showMultiDayTimes
                        popup
                        selectable
                        onSelectEvent={({id}) => {
                            const events = untisStore.overlappingEvents(id);
                            console.log(events);
                        }}
                        min={new Date(2023, 0, 1, 7, 0, 0)}
                        max={new Date(2023, 0, 1, 18, 0, 0)}
                    />
                )}
            </div>
        </Layout>
    )
});

export default Schedule;