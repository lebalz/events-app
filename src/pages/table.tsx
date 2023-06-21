import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import EventGrid from '../components/Event/EventGrid';
import Button from '../components/shared/Button';
import { mdiDownloadCircleOutline, mdiTools } from '@mdi/js';
import GridTable from '../components/shared/GridTable';
import Day from '../components/Event/EventFields/Day';
import Description from '../components/Event/EventFields/Description';
import DateTime from '../components/Event/EventFields/DateTime';
import Location from '../components/Event/EventFields/Location';
import UserGroup from '../components/Event/EventFields/UserGroup';
import Audience from '../components/Event/EventFields/Audience';
import DescriptionLong from '../components/Event/EventFields/DescriptionLong';
import Actions from '../components/Event/EventFields/Actions';
import Departments from '../components/Event/EventFields/Departments';
import Klasses from '../components/Event/EventFields/Klasses';
import styles from './table.module.scss';
import { Icon, SIZE_S } from '../components/shared/icons';

const Table = observer(() => {
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    return (
        <Layout>
            <div>
                <EventGrid events={[]} groupBy='kw' showFilter />
                <GridTable
                    className={styles.table}
                    data={viewStore.eventTable.events}
                    columns={{
                        day: { maxWidth: '2.8em', label: 'Tag', transform: (item) => item.fStartDate, render: (item) => <Day event={item} /> },
                        description: { maxWidth: '16em', label: 'Stichworte', render: (item) => <Description event={item} />},
                        start: { label: 'Start', render: (item) => <DateTime event={item}  time='start'/>, className: styles.flex },
                        end: { label: 'Ende', render: (item) => <DateTime event={item}  time='end'/> },
                        location: { label: 'Ort', render: (item) => <Location event={item} /> },
                        userGroup: { label: 'Gruppe', render: (item) => <UserGroup event={item} /> },
                        departmens: { label: 'Abteilungen', transform: (item) => item.departmentNames.join(', '), render: (item) => <Departments event={item} /> },
                        classes: { label: 'Klassen', transform: (item) => item.fClasses.map(t => t.text).join(', '), render: (item) => <Klasses event={item} /> },
                        descriptionLong: {maxWidth: '20em', label: 'Beschreibung', render: (item) => <DescriptionLong event={item} /> },
                        actions: { label:  <Icon path={mdiTools} size={SIZE_S} />, fixed: { right: 0 }, render: (item) => <Actions event={item} />, transform: (item) => item.id },
                    }}
                    groupBy='kw'
                    groupHeader={(item) => <div>KW {item.models[0].model.kw}</div>}
               />
                <Button
                    onClick={() => {
                        eventStore.downloadExcel().then((res) => {
                            console.log(res);
                            const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            document.body.appendChild(a);
                            a.href = url;
                            a.download = 'events.xlsx';
                            a.click();
                            document.body.removeChild(a);
                        });
                    }}
                    color='blue'
                    iconSide='left'
                    icon={mdiDownloadCircleOutline}
                    text="Download"
               />
            </div>
        </Layout>
    );
});

export default Table;
