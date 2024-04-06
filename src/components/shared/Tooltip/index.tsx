import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from 'reactjs-popup';


interface Props {
    title: string;
    children: React.ReactNode | React.ReactNode[];
}

const Tooltip = observer((props: Props) => {
    return (
        <Popup
            trigger={<span>{props.children}</span>}
            mouseEnterDelay={100}
            mouseLeaveDelay={200}
            on='hover'
            position={['top center', 'top center', 'top left', 'left center', 'right center']}
            arrow={false}
            offsetY={5}
        >
            <div className={clsx(styles.tooltip)}>
                {props.title}
            </div>
        </Popup>
    )
});

export default Tooltip;