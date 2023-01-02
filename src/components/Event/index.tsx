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

            <div className={clsx('card')}>
                <div className={clsx('card__header')}>
                    Neuer Termin
                </div>
                <div className={clsx('card__body')}>
                    <label htmlFor='start'>Datum Start</label>
                    <input type="datetime-local" id="start" name="start" value={Date.now()} />
                    <br></br>
                    <label htmlFor='ende'>Datum Start</label>
                    <input type="datetime-local" id="ende" name="ende" />
                </div>
                <div className={clsx('card__footer')}>
                    <button className={clsx('button', 'button--danger')}>Löschen</button>
                    <button className={clsx('button', 'button--success')}>Eingeben</button>
                </div>

            </div>
        </div>
    )
});

export default Event;