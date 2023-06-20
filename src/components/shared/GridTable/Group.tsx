import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useOnScreen } from '@site/src/stores/hooks';
import { DataItem } from './types';
import Row from './Row';
import { GroupRow } from '@site/src/stores/ViewStores/TableData';


interface Props<T> {
    row: GroupRow<T>;
    header: React.ReactNode;
    tableCssSelector: string;
    rowHeight: number;
}


const Group = observer(<T extends DataItem>(props: Props<T>) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const onScreen = useOnScreen(ref, props.tableCssSelector, "0% 30px 0% 30px");
    React.useEffect(() => {
        if (onScreen) {
            props.row.setExpanded(true);
        }
        props.row.setInView(onScreen);
    }, [onScreen, props.row]);
    const {row} = props;
    return (
        <>
            <div 
                className={clsx(styles.group)} 
                style={{ 
                    height: row.expanded ? undefined : `${row.models.length * props.rowHeight}px`,
                    gridColumnStart: 1,
                    gridColumnEnd: row.store.columnSize + 1,
                }}
                ref={ref}
            >
                {props.header}
            </div>
            {row.expanded && (
                row.models.map((model, idx) => (
                    <Row
                        key={idx}
                        row={model}
                        rowNr={idx}
                    />
                ))
            )}
        </>
    )
});

export default Group;
