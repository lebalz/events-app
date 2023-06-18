import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';

interface ColumnDefinition {
    name: string;
    key: string;
    sortable?: boolean;
    component?: React.ReactNode;
    className?: string;
    maxWidth?: string;
    width?: string;
}

type Row = {
    [column: string]: Cell;
};

interface Cell {
    value: string | number;
    span?: number;
    component?: React.ReactNode;
    className?: string;
}


const columnIndexes = (header: ColumnDefinition[]) => {
    const templateColumns = new Map<string, {index: number, style: React.CSSProperties}>();
    header.forEach((column, idx) => {
        templateColumns.set(column.key, {index: idx + 1, style: {maxWidth: column.maxWidth, width: column.width}});
    });
    return templateColumns;
}

interface RowProps<T extends {id: string | number}> {
    item: T;
    transformer: (item: T) => Row;
    colIndexes: Map<string, {index: number, style: React.CSSProperties}>;
    rowNr: number;
    striped?: boolean;
}

const GridRow = observer((props: RowProps<{id: string | number}>) => {
    const { colIndexes, item, transformer } = props;
    const row = transformer(item);
    const columns = [...colIndexes.entries()].sort((a, b) => a[1].index - b[1].index).map(([key, value]) => key);
    return (
        <>
            {columns.map((col, idx) => {
                const cell = row[col];
                return (
                    <div
                        key={idx}
                        className={clsx(styles.cell, styles.row, cell?.className, (props.striped && props.rowNr % 2 === 0) ? styles.even : styles.odd)}
                        style={{
                            gridColumnStart: colIndexes.get(col).index,
                            gridColumnEnd: cell?.span ? `span ${cell.span}` : colIndexes.get(col).index + 1,
                        }}
                    >
                        <div className={clsx(styles.content)} style={colIndexes.get(col)?.style}>
                            {cell?.component ?? cell?.value ?? '-'}
                        </div>
                    </div>
            )})}
        </>
    )
})

interface Props<T extends {id: string | number}> {
    header: ColumnDefinition[];
    transformer?: (item: T) => Row;
    data: T[];
    striped?: boolean;
}
const GridTable = observer(<T extends {id: string | number}>(props: Props<T>) => {
    const colIndexes = columnIndexes(props.header);
    const gridTemplateColumns = `repeat(${props.header.length}, max-content)`;
    const transformer = props.transformer
        ? props.transformer
        : (item: T) => (props.header.reduce((acc, column) => ({...acc, [column.key]: {value: item[column.key]}}), {}) as Row);
    return (
        <div
            className={clsx(styles.grid)}
            style={{gridTemplateColumns}}
        >
            {props.header.map((column, idx) => (
                <div
                    key={idx}
                    className={clsx(styles.cell, styles.header, column.className)}
                    style={{gridColumn: colIndexes.get(column.key).index}}
                >
                    <div className={clsx(styles.content)} style={colIndexes.get(column.key)?.style}>
                        {column.component || column.name}
                    </div>
                </div>
            ))}
            {props.data?.map((row, idx) => (
                <GridRow key={row.id} item={row} transformer={transformer} colIndexes={colIndexes} rowNr={idx} striped={props.striped} />
            ))}
        </div>
    )
});

export default GridTable;