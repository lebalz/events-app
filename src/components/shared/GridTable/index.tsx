import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Row from './Row';
import { ColumnDefinition, DataItem, Row as RowType } from './types';
import Group from './Group';
import _ from 'lodash';

const columnIndexes = (header: ColumnDefinition) => {
    const templateColumns = new Map<string, {index: number, style: React.CSSProperties}>();
    Object.entries(header).forEach((column, idx) => {
        const [key, value] = column;
        templateColumns.set(key, {index: idx + 1, style: {maxWidth: value.maxWidth, width: value.width}});
    });
    return templateColumns;
}

interface Props<T extends DataItem> {
    header: ColumnDefinition;
    transformer?: (item: T) => RowType;
    data: T[];
    groupBy?: keyof T;
    groupHeader?: (items: T[]) => React.ReactNode;
    striped?: boolean;
    sortColumn?: keyof T;
    sortDirection?: 'asc' | 'desc';
    batchSize?: number;
    defaultRowHeight?: number;
}
const GridTable = observer(<T extends DataItem>(props: Props<T>) => {
    const [groupedData, setGroupedData] = React.useState<DataItem[]>([]);
    const [sortColumn, setSortColumn] = React.useState<keyof T>(props.sortColumn);
    const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
    const [config, setConfig] = React.useState({
        transformer: props.transformer,
        defaultTransformer: (item: T) => (Object.keys(props.header).reduce((acc, column) => ({...acc, [column]: {value: item[column]}}), {}) as RowType),
        colIndexes: columnIndexes(props.header ?? {}),
        striped: props.striped,
        columnNames: Object.keys(props.header),
    });

    React.useEffect(() => {
        if (!props.groupBy && !props.batchSize) {
            if (sortDirection) {
                setGroupedData(_.orderBy(props.data, [sortColumn], [sortDirection ?? 'asc']));
            } else {
                setGroupedData(props.data);
            }
        }

        const grouped = new Map<string, T[]>();
        (props.data || []).forEach((item, idx) => {
            if (props.groupBy) {
                const key = item[props.groupBy] as string;
                if (!grouped.has(key)) {
                    grouped.set(key, []);
                }
                grouped.get(key)?.push(item);
            } else {
                const key = `b-${Math.floor(idx / (props.batchSize ?? 1))}`;
                if (!grouped.has(key)) {
                    grouped.set(key, []);
                }
                grouped.get(key)?.push(item);
            }
        });
        const data = [...grouped.keys()].map(key => {
            const items = sortColumn 
                ? _.orderBy(grouped.get(key), [sortColumn], [sortDirection ?? 'asc'])
                : grouped.get(key);
            return {
                id: key, 
                items: items, 
                header: props.groupHeader?.(items) || key,
                _component: (<Group
                    tableCssSelector={styles.grid}
                    items={items}
                    header={props.groupHeader?.(items)}
                    rowHeight={props.defaultRowHeight || 35}
                    config={config}
                />),
            };
        });
        setGroupedData(data as DataItem[]);
    }, [props.data, props.groupBy, props.groupHeader, sortColumn, sortDirection, config]);

    React.useEffect(() => {
        setConfig({
            transformer: props.transformer,
            defaultTransformer: (item: T) => (Object.keys(props.header).reduce((acc, column) => ({...acc, [column]: {value: item[column]}}), {}) as RowType),
            colIndexes: columnIndexes(props.header),
            striped: props.striped,
            columnNames: Object.keys(props.header),
        });
    }, [props.header, props.transformer, props.striped]);

    const gridTemplateColumns = `repeat(${props.header.length}, max-content)`;
    return (
        <div
            className={clsx(styles.grid)}
            style={{gridTemplateColumns}}
        >
            {Object.entries(props.header).map(([key, column], idx) => (
                <div
                    key={idx}
                    className={clsx(styles.cell, styles.header, column.className)}
                    style={{gridColumn: config.colIndexes.get(key).index}}
                    onClick={() => {
                        if (sortColumn === key) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                            setSortColumn(key as keyof T);
                            setSortDirection('asc');
                        }
                        console.log('click', key, sortColumn, sortDirection)
                    }}
                >
                    <div className={clsx(styles.content)} style={config.colIndexes.get(key)?.style}>
                        {column.component || column.label}
                    </div>
                </div>
            ))}
            {groupedData?.map((row, idx) => (
                <Row 
                    key={row.id}
                    item={row}
                    rowNr={idx}
                    config={config}
                />
            ))}
        </div>
    )
});

export default GridTable;