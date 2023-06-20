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
    data: (T & DataItem)[];
    batchSize?: number;
    defaultRowHeight?: number;
    groupHeader?: (group: GroupRow<T>) => React.JSX.Element;
}

const GridTable = observer(<T extends DataItem>(props: Props<T>) => {
    const [id] = React.useState(uuid());
    const viewStore = useStore('viewStore');
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        if (id && viewStore) {
            viewStore.tableData.register<T>(id, props.data, props);
            console.log('register', id);
            return () => {
                console.log('unregister', id);
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
    const gridTemplateColumns = `repeat(${config.columnSize}, max-content)`;
    return (
        <div className={clsx(styles.scroll)}>
            <div
                className={clsx(styles.grid)}
                style={{ gridTemplateColumns }}
                ref={ref}
            >
                {Object.entries(config.header).map(([key, column], idx) => (
                    <div
                        key={idx}
                        className={clsx(styles.cell, styles.header, column.className)}
                        style={{ gridColumn: config.colIndices.get(key as keyof T).index }}
                        onClick={() => {
                            config.setSortColumn(key as keyof T);
                        }}
                    >
                        <div className={clsx(styles.content)}>
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