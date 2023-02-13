import clsx from 'clsx';
import React, { useEffect } from 'react';
import styles from './styles.module.scss';
import { observer, useLocalObservable } from "mobx-react-lite";
import { useStore } from '@site/src/stores/hooks';
import _ from 'lodash';
import { action, observable } from 'mobx';
import EventRow from '../../Event/EventRow';
export const DEFAULT_ROW_HEIGHT = 40;
const DEFAULT_ROW_COUNT = 300;
const PRELOADED_ROWS = 10;

interface PlaceholderProps {
    height: number;
    color?: string;
}

const ScrollPlaceholder = observer((props: PlaceholderProps) => {
    return (
        <div style={{ height: `${props.height}px`, background: props.color }}>
        </div>
    )
})

const VirtualizedTable = observer(() => {
    const store = useStore('eventStore');
    return (
        <table className={clsx(styles.table)}>
            <thead>
                <tr>
                    <th>KW</th>
                    <th>Wochentag</th>
                    <th>Stichwort</th>
                    <th>Start</th>
                    <th>Ende</th>
                    <th>Ort</th>
                    <th>Schulen</th>
                    <th>Klassen</th>
                    <th>Beschreibung</th>
                </tr>
            </thead>
            <tbody>
                {store.events.map((event, index) => {
                    return (
                        <tr key={event.id} data-id={event.id}>
                            <td>{event.kw}</td>
                            <td>{event.weekday}</td>
                            <td>{event.description}</td>
                            <td>{`${event.startDate}:${event.startTime}`}</td>
                            <td>{`${event.endDate}:${event.endTime}`}</td>
                            <td>{event.location}</td>
                            <td>{event.departements.map((c, idx) => (
                                <span
                                    key={idx}
                                    className={clsx(
                                        'badge',
                                        'badge--primary',
                                        styles.badge,
                                        styles[c.toLowerCase()]
                                    )}
                                >
                                    {c}
                                </span>
                            ))}
                            </td>
                            <td>{event.classes.map((c, idx) => (
                                <span
                                    key={idx}
                                    className={clsx(
                                        'badge',
                                        'badge--secondary'
                                    )}
                                >
                                    {c}
                                </span>
                            ))
                            }</td>
                            <td>{event.descriptionLong}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
});

export default VirtualizedTable;