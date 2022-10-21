import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

moment.locale('de-CH');
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = momentLocalizer(moment)

const COLOR = {
    'GYM': 'light-blue',
    'FMS': 'orange',
    'WMS': 'green'
}

const Calendar = observer(() => {
    const eventStore = useStore('eventStore');
    const tasks = eventStore.events.map((e, idx) => {
        // const start = new Date(e.start.getTime());
        // const end = new Date(e.end.getTime());
        // if (fullDay) {
        //     start.setHours(0);
        //     start.setMinutes(0);
        //     end.setHours(24);
        //     end.setMinutes(0);
        // }
        return {
          start: e.start,
          end: e.end,
          title: e.description,
          description: e.descriptionLong,
          id: e.id
        }
    });
    const eventStyleGetter = (event, start, end, isSelected) => {
        const e = eventStore.find(event.id);
        if (!e) {
            return {};
        }
        if (e.categories.length === 1) {
            return {style: {
                backgroundColor: COLOR[e.categories[0]]
            }}
        }
        return {}
    };
    return (
        <div>
            {tasks.length > 0 && (
                <BigCalendar            
                    defaultDate={moment().toDate()}
                    localizer={localizer}
                    events={tasks}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    onSelectEvent={(record) => console.log(eventStore.find(record.id))}
                    eventPropGetter={eventStyleGetter}
                    popup
                    selectable

              />
            )}
        </div>
    )
});

export default Calendar;