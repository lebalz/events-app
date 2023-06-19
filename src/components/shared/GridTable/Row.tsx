import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { DataItem, Row as RowType } from './types';

interface Props<T extends DataItem> {
    item: T;
    rowNr: number;
    config: {
        transformer?: (item: T) => RowType;
        defaultTransformer: (item: T) => RowType;
        colIndexes: Map<string, {index: number, style: React.CSSProperties}>;
        striped?: boolean;
        columnNames: string[];
    }
}

const Row = observer((props: Props<DataItem>) => {
    const { config, item } = props;
    const { colIndexes, columnNames, striped } = config;
    if (item._component) {
        return (<>
            {item._component}
        </>);
    }
    const transformer = props.item._transformer ?? config.transformer ?? config.defaultTransformer;
    const row = transformer(item);
    console.log('row')
    return (
        <>
            {columnNames.map((col, idx) => {
                const cell = row[col];
                return (
                    <div
                        key={idx}
                        className={clsx(styles.cell, styles.row, cell?.className, (striped && props.rowNr % 2 === 0) ? styles.even : styles.odd)}
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
export default Row;