import React, { ForwardedRef } from 'react';
import clsx from 'clsx';
import { CURRENT_YYYY_KW, default as EventModel } from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Row from './Row';
import { createTransformer } from 'mobx-utils';
import _ from 'lodash';
import Batch from './Batch';
import Group from './Group';
import ColumnHeader from './ColumnHeader';
import { useStore } from '@site/src/stores/hooks';
import EventTable from '@site/src/stores/ViewStores/EventTable';

interface ConfigOptionsBase {
    width?: string;
    maxWidth?: string;
    maxContentWidth?: string;
    fixed?: { right: number; left?: undefined } | { left: number; right?: undefined };
    className?: string;
    colSpan?: number;
    componentProps?: Record<string, any>;
    onEdit?: {
        colSpan?: number;
        maxWidth?: string;
        maxContentWidth?: string;
    } /** the current event is edited */;
}

export interface ConfigOptionsSortable extends ConfigOptionsBase {
    sortable: boolean | string;
    direction?: 'asc' | 'desc';
    minWidthWhenActive?: string;
}

export type ConfigOptions = ConfigOptionsBase | ConfigOptionsSortable;

export const DefaultConfig: { [key: string]: ConfigOptions } = {
    updatedAt: { width: '7em', sortable: true, minWidthWhenActive: '7em' },
    createdAt: { width: '7em', sortable: true, minWidthWhenActive: '7em' },
    state: { width: '2.1em', sortable: true, minWidthWhenActive: '4em' },
    nr: { width: '2.1em', sortable: true, minWidthWhenActive: '4em' },
    isValid: { width: '2.1em', sortable: true, minWidthWhenActive: '4em' },
    isDuplicate: { sortable: true },
    select: { width: '2.3em', componentProps: { onSelect: () => undefined } },
    kw: { width: '2.8em', sortable: '3.3em', minWidthWhenActive: '4.5em' },
    teachingAffected: {
        width: '2.1em',
        sortable: true,
        minWidthWhenActive: '4em'
    },
    author: { width: '5em', sortable: true, minWidthWhenActive: '6em' },
    day: { width: '2.8em' },
    description: { width: '16em' },
    start: { sortable: true },
    end: { sortable: true },
    location: { maxWidth: '10em' },
    userGroup: { maxContentWidth: '7em' },
    departments: {
        maxContentWidth: '7em',
        onEdit: { maxWidth: '50em', colSpan: 2, maxContentWidth: '50em' }
    },
    classes: { maxContentWidth: '8em', onEdit: { colSpan: 0 } },
    linkedUsers: { maxContentWidth: '8em', onEdit: { colSpan: 0 } },
    descriptionLong: { width: '20em' },
    actions: {}
};

export const BATCH_SIZE = 15 as const;
export type ColumnConfig = (keyof typeof DefaultConfig | [keyof typeof DefaultConfig, ConfigOptions])[];

export interface Props {
    eventTable: EventTable;
    defaultSortBy?: keyof typeof DefaultConfig;
    className?: string;
    groupBy?: 'yearsKw';
}

export interface ViewEvent {
    type: 'event';
    index: number;
    model: EventModel;
}
export interface ViewGroup {
    type: 'group';
    groupBy: 'yearsKw';
    group: string;
    isCurrent?: boolean;
    events?: EventModel[];
}

const MemoGroup = React.memo(Batch);

const Grid = observer(
    React.forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
        const { eventTable, groupBy, defaultSortBy } = props;
        React.useEffect(() => {
            eventTable.setSortBy(defaultSortBy as string);
        }, [eventTable, defaultSortBy]);

        React.useEffect(() => {
            if (eventTable) {
                eventTable.setGroupBy(groupBy);
            }
        }, [groupBy, eventTable]);

        const onColumnClick = React.useCallback(
            (columnName: string) => {
                eventTable.onColumnClicked(columnName);
            },
            [eventTable]
        );
        const onSelectAll = React.useCallback(() => {
            console.log('Recreate onSelectAll');
            eventTable.flipFullSelection();
        }, [eventTable]);

        const gridTemplateColumns = `repeat(${eventTable.columns.length}, max-content)`;
        return (
            <div className={clsx(styles.scroll, props.className)} ref={ref}>
                <div className={clsx(styles.grid)} style={{ gridTemplateColumns }}>
                    {eventTable.columns.map((col, idx) => {
                        const [name, config] = col;
                        if (name === 'linkedUsers' && !eventTable.isLoggedIn) {
                            return null;
                        }
                        return (
                            <ColumnHeader
                                eventTable={eventTable}
                                key={idx}
                                name={name}
                                gridColumn={idx + 1}
                                active={name === eventTable.sortBy ? eventTable.sortDirection : undefined}
                                onClick={
                                    name === 'select' ? onSelectAll : () => onColumnClick(name as string)
                                }
                                {...config}
                            />
                        );
                    })}
                    {eventTable.groupedEvents.map((events, idx) => (
                        <MemoGroup key={idx} rowHeight={30} tableCssSelector={styles.grid}>
                            {events.map((item) => {
                                if (item.type === 'group') {
                                    return <Group key={item.group} {...item} />;
                                }
                                const event = item.model;
                                return (
                                    <Row
                                        key={event.id}
                                        event={event}
                                        columns={eventTable.columns}
                                        index={item.index}
                                    />
                                );
                            })}
                        </MemoGroup>
                    ))}
                </div>
            </div>
        );
    })
);

export default Grid;
