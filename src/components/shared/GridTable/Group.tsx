import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useOnScreen, useStore } from '@site/src/stores/hooks';
import { action } from 'mobx';
import { DataItem, Row as RowType } from './types';
import Row from './Row';


interface Props<T extends DataItem> {
    header: React.ReactNode;
    items: T[];
    tableCssSelector: string;
    config: {
        transformer?: (item: T) => RowType;
        defaultTransformer: (item: T) => RowType;
        colIndexes: Map<string, {index: number, style: React.CSSProperties}>;
        striped?: boolean;
        columnNames: string[];
    }
    rowHeight: number;
}


const Group = observer(<T extends DataItem>(props: Props<T>) => {
    const [expanded, setExpanded] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    const onScreen = useOnScreen(ref, props.tableCssSelector, "0% 30px 0% 30px");
    React.useEffect(() => {
        if (onScreen) {
            setExpanded(true);
        }
    }, [onScreen]);
    // React.useEffect(() => {
    //     if (props.order) {
    //         setExpanded(false);
    //     }
    // }, [props.order]);
    console.log('render group', expanded)

    return (
        <>
            <div 
                className={clsx(styles.group)} 
                style={{ 
                    height: expanded ? undefined : `${props.items.length * props.rowHeight}px`,
                    gridColumnStart: 1,
                    gridColumnEnd: props.config.columnNames.length + 1,
                }}
                ref={ref}
            >
                {props.header}
            </div>
            {expanded && (
                props.items.map((event, idx) => (
                    <Row
                        key={idx}
                        item={event}
                        config={props.config}
                        rowNr={idx}
                    />
                ))
            )}
        </>
    )
});

export default Group;
