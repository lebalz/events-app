import { Departements } from '@site/src/api/event';
import SchoolEvent from '@site/src/models/SchoolEvent';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import ToggleFilter from '../shared/ToggleFilter';
import styles from './EventList.module.scss';
import EventRow from './EventRow';

interface Props {
    events: SchoolEvent[];
}

const EventList = observer((props: Props) => {
    const eventStore = useStore('eventStore');
    const viewStore = useStore('viewStore');

    const onChange = (event: any, id: string) => {
        const param: any = {};
        param[event.target.name] = event.target.value;
        eventStore.updateEvent(id, param);
    };
    const userStore = useStore('userStore');
    const userId = userStore.current?.id;

    return (
        <div className={clsx(styles.container)}>
        <table className={clsx(styles.table)}>
            <thead>
                <tr>
                    <th>KW</th>
                    <th>Wochentag</th>
                    <th>Stichwort</th>
                    <th>Start</th>
                    <th>Ende</th>
                    {/* <th></th>
                    <th>Ende</th>
                    <th></th> */}
                    <th>Ort</th>
                    <th>
                        <div>
                            Schulen
                        </div>
                        {
                            <ToggleFilter
                                values={Object.values(Departements).map((key) => ({
                                    value: key,
                                    active: viewStore.eventTable.departments.has(key),
                                    color: `var(--${key.toLowerCase()})`
                                }))}
                                onChange={(value) => {
                                    if (viewStore.eventTable.departments.has(value)) {
                                        viewStore.eventTable.departments.delete(value);
                                    } else {
                                        viewStore.eventTable.departments.add(value);
                                    }
                                }}
                            />
                        }
                    </th>
                    <th>Klassen</th>
                    <th>Beschreibung</th>
                </tr>
            </thead>
            <tbody>
                {props.events.map((event) => (<EventRow key={event.id} event={event} onChange={onChange} locked={event.authorId !== userId} />))}
            </tbody>
        </table>
        </div>
    );
});

export default EventList;