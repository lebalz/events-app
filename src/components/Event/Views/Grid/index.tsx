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
    departmens: { maxContentWidth: '7em', onEdit: { maxWidth: '50em', colSpan: 2, maxContentWidth: '50em' } },
    classes: { maxContentWidth: '8em', onEdit: { colSpan: 0 } },
    descriptionLong: { width: '20em' },
    actions: {}
};

export const BATCH_SIZE = 15 as const;
export type ColumnConfig = (keyof typeof DefaultConfig | [keyof typeof DefaultConfig, ConfigOptions])[];

export interface Props {
    eventTable: EventTable;
    columns: ColumnConfig;
    defaultSortBy?: keyof typeof DefaultConfig;
    className?: string;
    groupBy?: 'yearsKw';
}

interface ViewEvent {
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
const createGroupEvents = createTransformer<
    {
        events: EventModel[];
        groupBy?: 'yearsKw';
        orderBy: keyof typeof DefaultConfig;
        direction: 'asc' | 'desc';
    },
    (ViewEvent | ViewGroup)[][]
>((data) => {
    const events = _.orderBy(data.events, [data.orderBy, 'start'], [data.direction, 'asc']);
    const transformed: (ViewEvent | ViewGroup)[] = [];
    if (data.groupBy) {
        const byGroup = _.groupBy(events, data.groupBy);
        let idx = 0;
        Object.keys(byGroup)
            .sort()
            .forEach((key) => {
                transformed.push({
                    type: 'group',
                    groupBy: data.groupBy,
                    group: key.split('-')[1].replace(/^0+/, ''),
                    isCurrent: key === CURRENT_YYYY_KW,
                    events: byGroup[key]
                });
                byGroup[key].forEach((event) => {
                    transformed.push({ type: 'event', index: idx, model: event });
                    idx++;
                });
            });
    } else {
        events.forEach((event, idx) => {
            transformed.push({ type: 'event', model: event, index: idx });
        });
    }
    return _.chunk(transformed, BATCH_SIZE);
});

const Grid = observer(
    React.forwardRef((props: Props, ref: ForwardedRef<HTMLDivElement>) => {
        const [sortBy, setSortBy] = React.useState<keyof typeof DefaultConfig>(
            props.defaultSortBy || 'start'
        );
        const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
        const { eventTable } = props;
        const { events } = eventTable;
        const groupEvents = React.useMemo(() => {
            const grouped = createGroupEvents({
                events: events,
                groupBy: props.groupBy,
                orderBy: sortBy,
                direction: sortDirection
            });
            return grouped;
        }, [events, sortBy, sortDirection]);
        const [columns, setColumns] = React.useState<[keyof typeof DefaultConfig, ConfigOptions][]>([]);
        React.useEffect(() => {
            const config: [keyof typeof DefaultConfig, ConfigOptions][] = [];

            props.columns.forEach((col, idx) => {
                const isConfig = typeof col !== 'string';
                const name = isConfig ? col[0] : col;
                const defaultConf = {
                    ...DefaultConfig[name],
                    ...(name === 'select' ? { componentProps: { eventTable } } : {})
                };
                if (eventTable.isDescriptionExpanded && name === 'description') {
                    defaultConf.width = '45em';
                }
                if (!defaultConf) {
                    return null;
                }
                config.push([
                    name,
                    {
                        ...defaultConf,
                        ...(isConfig ? col[1] : {}),
                        direction: sortBy === name ? sortDirection : undefined
                    }
                ]);
            });
            setColumns(config);
        }, [props.columns, eventTable.isDescriptionExpanded]);

        const gridTemplateColumns = `repeat(${props.columns.length}, max-content)`;
        return (
            <div className={clsx(styles.scroll, props.className)} ref={ref}>
                <div className={clsx(styles.grid)} style={{ gridTemplateColumns }}>
                    {columns.map((col, idx) => {
                        const [name, config] = col;
                        let isActive: 'asc' | 'desc' | boolean | undefined =
                            name === sortBy ? sortDirection : undefined;
                        let onClick = () => {
                            if (name === sortBy) {
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                                setSortBy(name);
                                setSortDirection('asc');
                            }
                        };
                        if (name === 'select') {
                            isActive = eventTable.selectedEvents.length === events.length;
                            onClick = () => {
                                eventTable.setSelectedEvents(
                                    events.map((e) => e.id),
                                    !isActive
                                );
                            };
                        }
                        return (
                            <ColumnHeader
                                eventTable={eventTable}
                                key={idx}
                                name={name}
                                gridColumn={idx + 1}
                                active={isActive}
                                onClick={onClick}
                                {...config}
                            />
                        );
                    })}
                    {groupEvents.map((events, idx) => (
                        <MemoGroup key={idx} rowHeight={30} tableCssSelector={styles.grid}>
                            {events.map((item) => {
                                if (item.type === 'group') {
                                    return <Group key={item.group} {...item} />;
                                }
                                const event = item.model;
                                return (
                                    <Row key={event.id} event={event} columns={columns} index={item.index} />
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
