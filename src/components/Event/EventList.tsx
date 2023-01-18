import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import styles from './EventList.module.scss';
import EventRow from './EventRow';

interface Props {
    onlyMyEvents?: boolean;
}

const EventList = observer((props: Props) => {
    const eventStore = useStore('eventStore');

    const onChange = (event: any, adrgId: string) => {
        const param: any = {};
        param[event.target.name] = event.target.value;
        eventStore.updateEvent(adrgId, param);
    };
    const userStore = useStore('userStore');
    const userId = userStore.current?.id;

    const events = (props.onlyMyEvents ? eventStore.byUser(userId) : eventStore.events)

    return (
        <table className={clsx(styles.table)}>
            <thead>
                <tr>
                    <th>KW</th>
                    <th>Wochentag</th>
                    <th>Stichwort</th>
                    <th>Zeitraum</th>
                    {/* <th></th>
                    <th>Ende</th>
                    <th></th> */}
                    <th>Ort</th>
                    <th>Schulen</th>
                    <th>Klassen</th>
                    <th>Beschreibung</th>
                </tr>
            </thead>
            <tbody>
                {events.map((event) => (<EventRow key={event.id} event={event} onChange={onChange} locked={event.authorId !== userId} />))}
            </tbody>
        </table>
    );
});

export default EventList;