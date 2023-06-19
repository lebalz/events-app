import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { DataItem, Row as RowType } from './types';
import { DataRow } from '@site/src/stores/ViewStores/TableData';

interface Props<T> {
    rowNr: number;
    row: DataRow<T>;
    striped?: boolean;
}

const Row = observer(<T extends DataItem>(props: Props<T>) => {
    const { row } = props;
    return (
        <>
            {row.cells.map((cell, idx) => {
                return (
                    <div
                        key={idx}
                        className={clsx(styles.cell, styles.row, cell?.className, (props.striped && props.rowNr % 2 === 0) ? styles.even : styles.odd)}
                        style={{
                            gridColumn: cell.gridColumn,
                            maxWidth: cell.maxWidth,
                        }}
                    >
                        <div className={clsx(styles.content)}>
                            {cell?.component ?? cell?.value ?? '-'}
                        </div>
                    </div>
            )})}
        </>
    )
})
export default Row;