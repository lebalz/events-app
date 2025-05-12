import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Popup from 'reactjs-popup';
import type { PopupPosition } from 'reactjs-popup/dist/types';

interface Props {
    title?: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
    wrapTrigger?: boolean;
    maxWidth?: string;
    defaultOpen?: boolean;
    position?: PopupPosition | PopupPosition[];
    arrow?: boolean;
    repositionOnResize?: boolean;
}

const MOUSE_ENTER_DELAY_MS = 250;
const MOUSE_LEAVE_DELAY_MS = 0;

const Tooltip = observer((props: Props) => {
    if (!props.title || props.disabled) {
        return props.children;
    }
    return (
        <Popup
            trigger={props.wrapTrigger ? <span>{props.children}</span> : props.children}
            mouseEnterDelay={MOUSE_ENTER_DELAY_MS}
            mouseLeaveDelay={MOUSE_LEAVE_DELAY_MS}
            on="hover"
            defaultOpen={props.defaultOpen}
            nested
            position={props.position ?? ['top center', 'top right', 'top left']}
            arrow={props.arrow ?? false}
            offsetY={8}
            repositionOnResize={props.repositionOnResize}
            contentStyle={{ width: 'max-content', maxWidth: props.maxWidth ?? 'min(50%, 30em)' }}
        >
            <div className={clsx(styles.tooltip)}>{props.title}</div>
        </Popup>
    );
});

export default Tooltip;
