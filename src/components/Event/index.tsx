import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { toGlobalTime } from '@site/src/models/helpers/time';
interface Props {
}

const Event = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    return (
        <div>
            <button
                onClick={() => {
                    const now = toGlobalTime(new Date());
                    const t1 = new Date(now);
                    t1.setHours(t1.getHours() + 1);
                    eventStore.create({start: now.toISOString(), end: t1.toISOString()});
                }}
                className={clsx('button', 'button--primary')}
            >
                + Neues Event
            </button>
        </div>
    )
});

export default Event;