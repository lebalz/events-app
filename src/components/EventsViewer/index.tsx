import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Event from '@site/src/models/Event';
import BulkActions, { Props as BulkActionProps } from '../Event/BulkActions';
import Grid, { Props as GridProps } from '../Event/Views/Grid';
import List from '../Event/Views/List';
import Calendar from '../Event/Views/Calendar';
import Timeline from '../Event/Views/Timeline';
import { Timeline as TimelineIcon } from '@site/src/components/shared/icons';
import _ from 'lodash';
import { mdiCalendarMonth, mdiCardTextOutline, mdiViewList } from '@mdi/js';
import { translate } from '@docusaurus/Translate';

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
    bulkActionConfig?: Omit<BulkActionProps, 'events'>;
    gridConfig: Omit<GridProps, 'events'>;
}

const EventsViewer = observer((props: Props) => {
    const count = props.events.length;
    return (
        <div className={clsx(styles.view)}>
            <BulkActions events={props.events} {...(props.bulkActionConfig || {})} />
            {count > 0 && props.type === View.Grid && <Grid events={props.events} {...props.gridConfig} />}
            {count > 0 && props.type === View.List && <List events={props.events} />}
            {count > 0 && props.type === View.Calendar && (
                <Calendar
                    events={props.events}
                    defaultDate={_.minBy(props.events, (e) => e.startTimeMs)?.start}
                    className={clsx(styles.calendar)}
                />
            )}
            {count > 0 && props.type === View.Timeline && <Timeline events={props.events} />}
        </div>
    );
});

export default EventsViewer;
