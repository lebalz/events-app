import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';
import BulkActions, { Props as BulkActionProps} from '../Event/BulkActions';
import Grid, { ColumnConfig, Props as GridProps } from '../Event/Views/Grid';
import List from '../Event/Views/List';
import Calendar from '../Event/Views/Calendar';
import Timeline from '../Event/Views/Timeline';

export enum View {
    Grid = 'grid',
    List = 'list',
    Calendar = 'calendar',
    Timeline = 'gantt',
}

interface Props {
    type: View;
    events: Event[];
    bulkActionConfig?: Omit<BulkActionProps, 'events'>;
    gridConfig: Omit<GridProps, 'events'>;
}

const EventsViewer = observer((props: Props) => {
    return (
        <div className={clsx(styles.view)}>
            <BulkActions events={props.events} {...(props.bulkActionConfig || {})} />
            {props.type === View.Grid && (
                <Grid events={props.events} {...props.gridConfig} />
            )}
            {props.type === View.List && (
                <List events={props.events} />
            )}
            {props.type === View.Calendar && (
                <Calendar events={props.events} />
            )}
            {props.type === View.Timeline && (
                <Timeline events={props.events} />
            )}

        </div>
    )
});

export default EventsViewer;