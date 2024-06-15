import React from 'react';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import { createTransformer } from 'mobx-utils';
import { Calendar as BigCalendar, ToolbarProps, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import siteConfig from '@generated/docusaurus.config';
import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';

const { CURRENT_LOCALE } = siteConfig.customFields as { CURRENT_LOCALE?: 'de' | 'fr' };
moment.locale(`${CURRENT_LOCALE}-CH`);

const localizer = momentLocalizer(moment)

interface Props {
    events: Event[],
    defaultDate?: Date,
    className?: string;
}

const createTasks = createTransformer((events: Event[]) => {
    return events.map((e, idx) => {
        return {
            start: e.start,
            end: e.end,
            title: `${e.isDeleted ? '❌: ' : ''}${e.description}`,
            description: e.descriptionLong,
            isDeleted: e.isDeleted,
            backgroundColor: e.affectedDepartments.length === 1 ? e.affectedDepartments[0].color : undefined,
            id: e.id
        }
    });
});

const Calendar = observer((props: Props) => {
    const tasks = createTasks(props.events);
    const viewStore = useStore('viewStore');
    const eventStyleGetter = React.useMemo(() => {
        return (event, start, end, isSelected) => {
            const style: React.CSSProperties = { backgroundColor: event.backgroundColor };
            if (event.isDeleted) {
                style.textDecoration = 'line-through';
            }
            return {
                style: style
            };
        };
    }, []);
    const { defaultDate, formats, components } = React.useMemo(
      () => ({
        defaultDate: props.defaultDate ? props.defaultDate : new Date(viewStore.calendarViewDate),
        components: {},
        formats: {
          dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'dd D.M', culture),
        },
      }),
      [viewStore.calendarViewDate]
    )
    return (
        <div className={clsx(props.className)}>
            <BigCalendar
                defaultView='week'
                defaultDate={defaultDate}
                formats={formats}
                localizer={localizer}
                events={tasks}
                scrollToTime={new Date(`${viewStore.calendarViewDate}T07:30:00`)}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '95vh' }}
                onSelectEvent={(record) => {
                    viewStore.setEventModalId(record.id)
                }}
                components={components}
                eventPropGetter={eventStyleGetter}
                onNavigate={(date) => {
                    viewStore.setCalendarViewDate(date);
                }}
                popup
                messages={{
                    next: translate({ message: "Nächste", id: 'calendar.button.nextWeek', description: 'button to show the next week on the calendar' }),
                    previous: translate({ message: "Vorherige", id: 'calendar.button.previousWeek', description: 'button to show the previous week on the calendar' }),
                    today: translate({ message: "Heute", id: 'calendar.button.today', description: 'button to show today on the calendar' }),
                    month: translate({ message: "Monat", id: 'calendar.button.month', description: 'button to show the calendar by month' }),
                    week: translate({ message: "Woche", id: 'calendar.button.week', description: 'button to show the calendar by week' }),
                    day: translate({ message: "Tag", id: 'calendar.button.day', description: 'button to show the calendar by day' }),
                    agenda: translate({ message: "Agenda", id: 'calendar.button.agenda', description: 'button to show the calendar as list' }),
                    date: translate({ message: "Datum", id: 'calendar.field.date', description: 'title of the table for the date' }),
                    time: translate({ message: "Zeit", id: 'calendar.field.time', description: 'title of the table for the time' }),
                    event: translate({ message: "Event", id: 'calendar.field.event', description: 'title of the table for the event' }),
                    noEventsInRange: translate({ message: "Keine Events in diesem Zeitraum", id: 'calendar.message.noevent', description: 'message if no event in time range' }),
                    tomorrow: translate({ message: "Morgen", id: 'calendar.button.tomorrow', description: 'button label to navigate to the next day' }),
                    work_week: translate({ message: "Arbeitswoche", id: 'calendar.button.workWeek', description: 'button label to display a work week' }),
                    yesterday: translate({ message: "Gestern", id: 'calendar.button.yesterday', description: 'button label to navigate to the previous day' }),
                    allDay: translate({ message: "Ganzer Tag", id: 'calendar.message.allDay', description: 'message if an event spans the whole day' }),
                    showMore: total => `+${total} ${translate({ message: 'weitere', id: 'calendar.button.plus', description: 'button label to show more events' })}`
                }}
            />
        </div>
    )
});

export default Calendar;