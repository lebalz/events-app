import Layout from '@theme/Layout';
import React from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import styles from './exp.module.scss';
import clsx from 'clsx';

// These item sizes are arbitrary.
// Yours should be based on the content of the item.
interface TSProps {
    duration: number;
    start: number;
    width: number;
    scale: number;
}
const TimeSpan = (props: TSProps) => {
    const timeSpentBefore = props.start * props.scale;
    const timeSpentAfter = (props.width - props.duration - props.start) * props.scale;
    const duration = props.duration * props.scale;

    return (
        <div className={clsx(styles.timeSpan)}>
            <div className={clsx(styles.spacer)} style={{ flexGrow: timeSpentBefore }}></div>
            <div
                className={clsx(styles.time)}
                style={{ flexGrow: duration }}
            >
                <div className={clsx(styles.timeText)}>
                    Hello
                </div>
            </div>
            <div className={clsx(styles.spacer)} style={{ flexGrow: timeSpentAfter }}></div>
        </div>
    );
}

const Cell = ({ columnIndex, rowIndex, style }) => (
    <div style={style}>
        <div>
            <TimeSpan 
                duration={200}
                start={(rowIndex / 1000) * (10000-200)} 
                width={10000} 
                scale={1} />
        </div>
    </div>
);

const Example = () => (

    <Layout>
        <div className={clsx(styles.timeSpans)} style={{minHeight: '90vh', maxHeight: '100vh'}}>
            <AutoSizer>
                {({ height, width }) => (
                    <Grid
                        columnCount={1}
                        columnWidth={10000}
                        height={height}
                        rowCount={1000}
                        rowHeight={22}
                        width={width}
                    >
                        {Cell}
                    </Grid>
                )}
            </AutoSizer>,
        </div>
    </Layout >
);

export default Example;