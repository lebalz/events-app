import React from 'react';
import clsx from 'clsx';
import { default as EventModel } from '@site/src/models/Event';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Row from './Row';
import { createTransformer } from 'mobx-utils';
import _ from 'lodash';
import Batch from './Batch';
import Group from './Group';
import ColumnHeader from './ColumnHeader';

interface ConfigOptionsBase {
    width?: string;
    maxWidth?: string;
    maxContentWidth?: string;
    fixed?: { right: number, left?: undefined } | { left: number, right?: undefined };
    className?: string;
    colSpan?: number;
    componentProps?: Record<string, any>;
    onEdit?: { colSpan?: number, maxWidth?: string, maxContentWidth?: string }; /** the current event is edited */
}

export interface ConfigOptionsSortable extends ConfigOptionsBase {
    sortable: boolean | string;
    direction?: 'asc' | 'desc';
    minWidthWhenActive?: string;
}

export type ConfigOptions = ConfigOptionsBase | ConfigOptionsSortable;


export const DefaultConfig: {[key: string]: ConfigOptions} = {
    state: { width: '2.1em', sortable: true, minWidthWhenActive: '4em' },
    isValid: { width: '2.1em', sortable: true, minWidthWhenActive: '4em' },
    isDuplicate: { sortable: true },
    select: { width: '2.3em', componentProps: {onSelect: () => undefined} },
    kw: { width: '2.8em', sortable: '3.3em', minWidthWhenActive: '4.5em' },
    teachingAffected: { width: '2.0em', sortable: true, minWidthWhenActive: '4em' },
    author: { width: '5em', sortable: true, minWidthWhenActive: '6em' },
    day: { width: '2.8em' },
    description: { width: '16em' },
    start: { sortable: true},
    end: { sortable: true},
    location: { maxWidth: '10em'},
    userGroup: { maxContentWidth: '7em'},
    departmens: { maxContentWidth: '7em', onEdit: {maxWidth: '25em', colSpan: 2, maxContentWidth: '25em'} },
    classes: { maxContentWidth: '8em', onEdit: {colSpan: 0} },
    descriptionLong: { width: '20em' },
    actions: {},
};

export const BATCH_SIZE = 15 as const;
export type ColumnConfig = (keyof typeof DefaultConfig | [keyof typeof DefaultConfig, ConfigOptions])[];

interface Props {
    events: EventModel[];
    columns: ColumnConfig;
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
    events?: EventModel[];
}

const MemoGroup = React.memo(Batch);
const createGroupEvents = createTransformer<{events: EventModel[], groupBy?: 'yearsKw', orderBy: keyof typeof DefaultConfig, direction: 'asc' | 'desc'},  (ViewEvent | ViewGroup)[][]>((data) => {
    const events = _.orderBy(data.events, [data.orderBy, 'start'], [data.direction, 'asc']);
    const transformed: (ViewEvent | ViewGroup)[] = [];
    if (data.groupBy) {
        const byGroup = _.groupBy(events, data.groupBy);
        let idx = 0;

        Object.keys(byGroup).sort().forEach(key => {
            transformed.push({type: 'group', groupBy: data.groupBy, group: key.split('-')[1], events: byGroup[key]});
            byGroup[key].forEach(event => {
                transformed.push({type: 'event', index: idx, model: event});
                idx++;
            });
        });
    } else {
        events.forEach((event, idx) => {
            transformed.push({type: 'event', model: event, index: idx});
        });
    }
    return _.chunk(transformed, BATCH_SIZE);
});

const EventGrid = observer((props: Props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [sortBy, setSortBy] = React.useState<keyof typeof DefaultConfig>('start');
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const groupEvents = React.useMemo(() => {
        return createGroupEvents({
            events: props.events,
            groupBy: props.groupBy,
            orderBy: sortBy,
            direction: sortDirection
        });
    }, [props.events, sortBy, sortDirection]);
    const [columns, setColumns] = React.useState<[keyof typeof DefaultConfig, ConfigOptions][]>([]);
    React.useEffect(() => {
        const config: [keyof typeof DefaultConfig, ConfigOptions][] = [];
        const onSelect = (event: EventModel, selected: boolean, shiftKey: boolean) => {
            if (selected && shiftKey) {
                const items = groupEvents.flat().filter(e => e.type === 'event').map(e => (e as ViewEvent).model);
                const idx = items.findIndex(e => e.id === event.id);
                const topIdx = items.slice(0, idx).findLastIndex(e => e.selected);
                if (topIdx > -1) {
                    items.slice(topIdx, idx).forEach(e => e.setSelected(selected));
                }
            }
            event.setSelected(selected);
        };
        props.columns.forEach((col, idx) => {
            const isConfig = typeof col !== 'string';
            const name = isConfig ? col[0] : col;
            const defaultConf = {...DefaultConfig[name], ...(name === 'select' ? {componentProps: {onSelect}} : {})};
            if (!defaultConf) {
                return null;
            }
            config.push([name, { ...defaultConf, ...(isConfig ? col[1] : {}), direction: sortBy === name ? sortDirection : undefined }]);
        });
        setColumns(config);
    }, [props.columns, groupEvents]);

    const gridTemplateColumns = `repeat(${props.columns.length}, max-content)`;
    return (
        <div className={clsx(styles.scroll, props.className)}>
            <div
                className={clsx(styles.grid)}
                style={{ gridTemplateColumns }}
                ref={ref}
            >
                {
                    columns.map((col, idx) => {
                        const [name, config] = col;
                        let isActive: 'asc' | 'desc' | boolean | undefined = name === sortBy ? sortDirection : undefined;
                        let onClick = () => {
                            if (name === sortBy) {
                                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                            } else {
                                setSortBy(name);
                                setSortDirection('asc');
                            }
                        };
                        if (name === 'select') {
                            isActive = props.events.every(e => e.selected);
                            onClick = () => {
                                props.events.forEach(e => e.setSelected(!isActive));
                            }
                        }
                        return (<ColumnHeader
                            key={idx}
                            name={name}
                            gridColumn={idx + 1}
                            active={isActive}
                            onClick={onClick}
                            {...config}
                        />);
                    })
                }
                {
                    groupEvents.map((events, idx) => (
                        <MemoGroup
                            key={idx}
                            rowHeight={30}
                            tableCssSelector={styles.grid}
                        >
                            {
                                events.map(item => {
                                    if (item.type === 'group') {
                                        return (<Group key={item.group} {...item} />);
                                    }
                                    const event = item.model;
                                    return (
                                        <Row key={event.id} event={event} columns={columns} index={item.index} />
                                    )
                                })
                            }
                        </MemoGroup>
                    ))
                }
            </div>
        </div>
    )
});

export default EventGrid;