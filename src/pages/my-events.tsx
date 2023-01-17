import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { runInAction } from 'mobx';
import styles from './table.module.scss';
import Layout from '@theme/Layout';
import Event from '../components/Event';

const Table = observer(() => {
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const myEvents = eventStore.byUser(userStore.current?.id).sort((a, b) => b.start.getTime() - a.start.getTime());
    return (
        <Layout>
            <div>
                <Event />
                <table>
                    <thead>
                        <tr>
                            <th>KW</th>
                            <th>Wochentag</th>
                            <th>Stichwort</th>
                            <th>Beginn</th>
                            <th></th>
                            <th>Ende</th>
                            <th></th>
                            <th>Ort</th>
                            <th>Schulen</th>
                            <th>Klassen</th>
                            <th>Beschreibung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myEvents.map((event, idx) => {
                            return (
                                <tr
                                    key={idx}
                                    onClick={() => {
                                        // console.log(userStore.current.isAffected(event));
                                    }}
                                >
                                    <td>{event.kw}</td>
                                    <td>{event.weekday}</td>
                                    <td>{event.description}</td>
                                    <td>{event.startDate}</td>
                                    <td>{event.allDay ? '' : event.startTime}</td>
                                    <td>{event.allDay && event.startDate === event.endDate ? '' : event.endDate}</td>
                                    <td>{event.allDay ? '' : event.endTime}</td>
                                    <td>{event.location}</td>
                                    <td>
                                        {event.departements.map((c, idx) => (
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
                                    <td>
                                        {event.classes.map((c, idx) => (
                                            <span
                                                key={idx}
                                                className={clsx(
                                                    'badge',
                                                    'badge--secondary'
                                                )}
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </td>
                                    <td>{event.descriptionLong}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
});

export default Table;
