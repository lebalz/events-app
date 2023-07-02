import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useOnScreen, useStore } from '@site/src/stores/hooks';
import Event from '@site/src/models/Event';

interface Props<T extends object> {
    batchSize: number;
    events: Event[];
    GroupHeader?: ({items}: {items: T[]}) => React.JSX.Element;
    DataComponent: ({item}: {item: T}) => React.JSX.Element;
    parentRootCssSelector: string;
}

const BatchedData = observer(<T extends object>(props: Props<T>) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const onScreen = useOnScreen(ref, props.parentRootCssSelector, "0% 30px 0% 30px");
    React.useEffect(() => {
        // if (onScreen) {
        //     props.row.setExpanded(true);
        // }
        // props.row.setInView(onScreen);
    }, [onScreen, props.data]);
    return (
        <>
            <div
                style={{ 
                    height: row.expanded ? undefined : `${row.models.length * props.rowHeight}px`,
                    gridColumnStart: 1,
                    gridColumnEnd: row.store.columnCount + 1,
                }}
                ref={ref}
            >
                {props.GroupHeader && <props.GroupHeader items={props.data} />}
            </div>
            {row.expanded && (
                row.models.map((model, idx) => (
                    <Row
                        key={idx}
                        row={model}
                        rowNr={idx}
                        onClick={props.onRowClick}
                    />
                ))
            )}
        </>
    )
});

export default BatchedData;