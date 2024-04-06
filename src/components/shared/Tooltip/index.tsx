import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Popup from 'reactjs-popup';


interface Props {
    title?: string;
    children: React.ReactNode | React.ReactNode[];
}

const MOUSE_ENTER_DELAY_MS = 250;
const MOUSE_LEAVE_DELAY_MS = 200;

const Tooltip = observer((props: Props) => {
    if (!props.title) {
        return props.children;
    }
    return (
        <Popup
            trigger={<span>{props.children}</span>}
            mouseEnterDelay={MOUSE_ENTER_DELAY_MS}
            mouseLeaveDelay={MOUSE_LEAVE_DELAY_MS}
            on='hover'
            position={['top center', 'top right', 'top left', ]}
            arrow={false}
            offsetY={5}
            contentStyle={{width: 'max-content', maxWidth: '50%'}}
        >
            <div className={clsx(styles.tooltip)}>
                {props.title}
            </div>
        </Popup>
    )
});

export default Tooltip;