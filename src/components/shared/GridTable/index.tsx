import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Row from './Row';
import { ColumnDefinition, DataItem, Row as RowType } from './types';
import Group from './Group';
import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import { Config, GroupRow } from '@site/src/stores/ViewStores/TableData';

interface Props<T> {
    config: Config<T>;
    batchSize?: number;
    defaultRowHeight?: number;
    groupHeader?: (group: GroupRow<T>) => React.JSX.Element;
}

const GridTable = observer(<T extends DataItem>(props: Props<T>) => {
    const { config } = props;
    if (!config) {
        return null;
    }
    const gridTemplateColumns = `repeat(${config.columnSize}, max-content)`;
    return (
        <div
            className={clsx(styles.grid)}
            style={{ gridTemplateColumns }}
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
                            header={props.groupHeader(row)}
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
    )
});

export default GridTable;