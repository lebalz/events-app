import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Row from './Row';
import Group from './Group';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Config, ConfigProps, DataItem, GroupRow } from '@site/src/stores/ViewStores/TableData';
import { useStore } from '@site/src/stores/hooks';

interface Props<T> extends ConfigProps<T> {
    mobxId?: string;
    data: (T & DataItem)[];
    batchSize?: number;
    defaultRowHeight?: number;
    className?: string;
    groupHeader?: (group: GroupRow<T>) => React.JSX.Element;
}

const GridTable = observer(<T extends DataItem>(props: Props<T>) => {
    const [id] = React.useState(props.mobxId || uuid());
    const viewStore = useStore('viewStore');
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (id && viewStore) {
            viewStore.tableData.register<T>(id, props.data, props);
            return () => {
                viewStore.tableData.unregister(id);
            }
        }
    },[id, viewStore]);
    React.useEffect(() => {
        if (id && viewStore) {
            const config = viewStore.tableData.tables.get(id);
            if (config) {
                config.setData(props.data);
            }
        }
    }, [id, viewStore, props.data]);
    React.useEffect(() => {
        if (id && viewStore) {
            const config = viewStore.tableData.tables.get(id);
            if (config) {
                config.updateConfig(props);
            }
        }
    }, [id, viewStore, props.columns, props.groupBy, props.batchSize, props.sortColumn, props.sortDirection]);
    const config = viewStore.tableData.tables.get(id);
    if (!config) {
        return null;
    }
    const gridTemplateColumns = `repeat(${config.columnCount}, max-content)`;
    return (
        <div className={clsx(styles.scroll, props.className)}>
            <div
                className={clsx(styles.grid)}
                style={{ gridTemplateColumns }}
                ref={ref}
            >
                {Object.entries(config.columns).map(([key, column], idx) => (
                    <div
                        key={idx}
                        className={clsx(styles.cell, styles.header, column.className)}
                        style={{
                            gridColumn: config.colIndices.get(key as keyof T).index, 
                            width: column.width,
                            maxWidth: column.maxWidth,
                            position: column.fixed ? 'sticky' : undefined,
                            left: column.fixed?.left,
                            right: column.fixed?.right
                        }}
                        onClick={() => {
                            config.setSortColumn(key as keyof T);
                        }}
                    >
                        <div 
                            className={clsx(styles.content)}
                        >
                            {column.component || column.label}
                        </div>
                    </div>
                ))}
                {config.rows.map((row, idx) => {
                    if (row.type === 'group') {
                        return (
                            <Group
                                key={idx}
                                row={row}
                                tableCssSelector={styles.grid}
                                header={props.groupHeader && props.groupHeader(row)}
                                rowHeight={props.defaultRowHeight ?? 35}
                            />
                        )
                    }
                    return (
                        <Row
                            key={row.id}
                            row={row}
                            rowNr={idx}
                        />
                    )
                })}
            </div>
        </div>
    )
});

export default GridTable;