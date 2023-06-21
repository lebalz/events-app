import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { DataItem, DataRow } from '@site/src/stores/ViewStores/TableData';

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
                if (cell.hidden) {
                    return null;
                }
                return (
                    <div
                        key={idx}
                        className={clsx(styles.cell, styles.row, (props.striped && props.rowNr % 2 === 0) ? styles.even : styles.odd)}
                        style={{
                            gridColumn: `${cell.gridColumn} / span ${cell.colSpan}`,
                            maxWidth: cell.maxWidth,
                            width: cell.width,
                            position: cell.fixed ? 'sticky' : undefined,
                            left: cell.fixed?.left,
                            right: cell.fixed?.right
                        }}
                    >
                        <div className={clsx(styles.content, cell?.className )}>
                            {cell?.component ?? cell?.value ?? '-'}
                        </div>
                    </div>
            )})}
        </>
    )
})
export default Row;