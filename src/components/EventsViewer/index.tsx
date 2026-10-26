import clsx from 'clsx';

import { translate } from '@docusaurus/Translate';
import { mdiCalendarMonth, mdiCardTextOutline, mdiViewList } from '@mdi/js';
import { Timeline as TimelineIcon } from '@site/src/components/shared/icons';
import Event from '@site/src/models/Event';
import EventTable from '@site/src/stores/ViewStores/EventTable';
import _ from 'es-toolkit/compat';
import { observer } from 'mobx-react-lite';
import BulkActions, { Props as BulkActionProps } from '../Event/BulkActions';
import { COLUMN_CONFIG } from '../Event/UsersEvents';
import Calendar from '../Event/Views/Calendar';
import Grid, { ColumnConfig, Props as GridProps } from '../Event/Views/Grid';
import List from '../Event/Views/List';
import Timeline from '../Event/Views/Timeline';
import { EventTableContext } from '../Event/hooks/useEventTable';
import Loader from '../shared/Loader';
import styles from './styles.module.scss';
import { useEventTable } from './useEventTable';

export enum View {
    Grid = 'grid',
    List = 'list',
    Calendar = 'calendar',
    Timeline = 'timeline'
}

export const ViewIcons: { [key in View]: string } = {
    [View.Grid]: mdiViewList,
    [View.List]: mdiCardTextOutline,
    [View.Calendar]: mdiCalendarMonth,
    [View.Timeline]: TimelineIcon
};
export const ViewTranslations: { [key in View]: string } = {
    [View.Grid]: translate({
        message: 'Tabelle',
        id: 'navcard.table.text',
        description: 'Button text for navigating to the table page'
    }),
    [View.List]: translate({
        message: 'Liste',
        id: 'navcard.list.text',
        description: 'View text for the event list'
    }),
    [View.Calendar]: translate({
        message: 'Kalender',
        id: 'navcard.calendar.text',
        description: 'Button text for navigating to the calendar page'
    }),
    [View.Timeline]: translate({
        message: 'Zeitachse',
        id: 'navcard.gantt.text',
        description: 'Button text for navigating to the gantt page'
    })
};

interface Props {
    type: View;
    events: Event[];
    bulkActionConfig?: Omit<BulkActionProps, 'events' | 'eventTable'>;
    gridConfig?: Omit<GridProps, 'events' | 'eventTable'> & { columns?: ColumnConfig };
    eventTable?: EventTable;
}

const EventsViewer = observer((props: Props) => {
    const eventTable = useEventTable(
        props.events,
        props.gridConfig?.columns ?? COLUMN_CONFIG,
        props.eventTable
    );
    if (!eventTable) {
        return <Loader />;
    }
    const count = eventTable.events.length;
    return (
        <div className={clsx(styles.view)}>
            <EventTableContext.Provider value={eventTable}>
                <BulkActions eventTable={eventTable} {...(props.bulkActionConfig || {})} />
                {count > 0 && props.type === View.Grid && (
                    <Grid eventTable={eventTable} {...props.gridConfig} />
                )}
                {count > 0 && props.type === View.List && <List events={eventTable.events} />}
                {count > 0 && props.type === View.Calendar && (
                    <Calendar
                        events={eventTable.events}
                        defaultDate={_.minBy(eventTable.events, (e) => e.startTimeMs)?.start}
                        className={clsx(styles.calendar)}
                    />
                )}
                {count > 0 && props.type === View.Timeline && <Timeline events={eventTable.events} />}
            </EventTableContext.Provider>
        </div>
    );
});

export default EventsViewer;
