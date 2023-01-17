import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
interface Props {
}

const Event = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    return (
        <div>
            <button
                onClick={() => {
                    eventStore.newEvent()
                }}
                className={clsx('button', 'button--primary')}
            >
                + Neues Event
            </button>
        </div>
    )
});

export default Event;