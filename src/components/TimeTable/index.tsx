import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import siteConfig from '@generated/docusaurus.config';
const { CURRENT_LOCALE } = siteConfig.customFields as { CURRENT_LOCALE?: 'de' | 'fr' };

moment.locale(`${CURRENT_LOCALE}-CH`);
import 'react-big-calendar/lib/css/react-big-calendar.css';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Klass from '@site/src/models/Untis/Klass';
import { DAYS } from '@site/src/models/helpers/time';
import Lesson from '@site/src/models/Untis/Lesson';

const localizer = momentLocalizer(moment);
interface Props {}

interface EventProps {
    subject: string;
    classes: string;
    id: number;
}

interface FullEventProps extends EventProps {
    start: Date;
    end: Date;
}

const Event = (props) => {
    const event: EventProps = props.event;
    return (
        <span>
            <strong>{event.subject}</strong>
            {': '}
            <i>{event.classes}</i>
        </span>
    );
};

const TimeTable = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const untisStore = useStore('untisStore');

    const lessons = React.useMemo(() => {
        const lsns = (viewStore.usersLessons || [])
            .filter((l) => l.isFirstSuccessiveLesson)
            .map((l, idx): FullEventProps => {
                const klGroups = Lesson.GroupedClassesByYear([l]);
                // const klGroups = Klass.ClassNamesGroupedByYear(l.classes);
                // const kl = Object.values(klGroups).join(', ');
                const kl = Object.values(klGroups).sort().join(', ');
                const lastLesson = l.lastSuccessiveLesson ?? l;
                return {
                    start: l.start,
                    end: lastLesson.end,
                    subject: l.subject,
                    classes: kl,
                    id: l.id
                };
            });
        return lsns;
    }, [viewStore.usersLessons, untisStore.initialized]);

    const week = React.useMemo(() => {
        return {
            event: Event
        };
    }, []);

    return (
        <div className={clsx(styles.timeTable)}>
            {lessons.length > 0 && (
                <BigCalendar
                    defaultView="work_week"
                    toolbar={false}
                    views={['work_week']}
                    defaultDate={new Date()}
                    formats={{ dayFormat: (date: Date) => `${DAYS[date.getDay()]}.` }}
                    localizer={localizer}
                    className={styles.calendar}
                    events={lessons}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    showMultiDayTimes
                    popup
                    selectable
                    components={{
                        work_week: week
                    }}
                    onSelectEvent={({ id }) => {
                        console.log(untisStore.findLesson(id)?.props);
                    }}
                    min={new Date(2023, 0, 1, 7, 0, 0)}
                    max={new Date(2023, 0, 1, 18, 0, 0)}
                />
            )}
        </div>
    );
});

export default TimeTable;
