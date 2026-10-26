import { useOnScreen } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { BATCH_SIZE } from '.';
import styles from './styles.module.scss';

interface Props {
    tableCssSelector: string;
    rowHeight: number;
    children: React.ReactNode;
}

const Batch = observer((props: Props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = React.useState(false);
    const onScreen = useOnScreen(ref, props.tableCssSelector, '0% 30px 0% 30px');
    React.useEffect(() => {
        if (onScreen) {
            setExpanded(true);
        }
    }, [onScreen]);
    return (
        <>
            <div
                className={clsx(styles.batch)}
                style={{
                    height: expanded ? undefined : `${BATCH_SIZE * props.rowHeight}px`,
                    gridColumnStart: 1,
                    gridColumnEnd: -1 /** span the full grid */
                }}
                ref={ref}
            ></div>
            {expanded && props.children}
        </>
    );
});

export default Batch;
