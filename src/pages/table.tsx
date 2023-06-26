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
import Select from '../components/Event/EventFields/Select';
import DepartmentsOrAudiencePicker from '../components/Event/EventFields/DepartmentsOrAudience';
import {useWindowSize} from '@docusaurus/theme-common';

const Table = observer(() => {
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const windowSize = useWindowSize();
    return (
        <Layout>
            <div>
                <EventGrid events={[]} groupBy='kw' showFilter />
                <GridTable
                    className={styles.table}
                    data={viewStore.semester?.events || []}
                    columns={{
                        select: { 
                            label: '', 
                            render: (item, self) => (
                                <Select 
                                    event={item} 
                                    onSelect={(selected: boolean, shiftKey: boolean) => {
                                        const idx = self.items.findIndex(i => i.model.id === item.id);
                                        const topIdx = self.items.slice(0, idx).findLastIndex(i => i.model.selected);
                                        console.log(idx, topIdx);
                                        if (shiftKey) {
                                            if (topIdx > -1) {
                                                self.items.slice(topIdx, idx).forEach(i => i.model.setSelected(selected));
                                            }
                                        }
                                        item.setSelected(selected)
                                    }}
                            />),
                            transform: (item) => item.id
                        },
                        day: { width: '2.8em', label: 'Tag', transform: (item) => item.fStartDate, render: (item) => <Day event={item} /> },
                        description: { width: '16em', label: 'Stichworte', render: (item) => <Description event={item} />},
                        start: { label: 'Start', render: (item) => <DateTime event={item}  time='start'/>, className: styles.flex },
                        end: { label: 'Ende', render: (item) => <DateTime event={item}  time='end'/>,  className: styles.flexEnd },
                        location: { label: 'Ort', render: (item) => <Location event={item} /> },
                        userGroup: { label: 'Gruppe', render: (item) => <UserGroup event={item} /> },
                        departmens: { label: 'Abteilungen', transform: (item) => item.departmentNames.join(', '), render: (item) => <DepartmentsOrAudiencePicker event={item} />, colSpan: (item) => item.isEditing ? 2 : 1 },
                        classes: { label: 'Klassen', transform: (item) => item.fClasses.map(t => t.text).join(', '), render: (item) => <Klasses event={item} />, hidden: (item) => item.isEditing },
                        descriptionLong: {width: '20em', label: 'Beschreibung', render: (item) => <DescriptionLong event={item} /> },
                        actions: { label:  <Icon path={mdiTools} size={SIZE_S} />, fixed: { right: 0 }, render: (item) => <Actions event={item} />, transform: (item) => item.id },
                    }}
                    groupBy='kw'
                    groupHeader={(item) => <div>KW {item.models[0].model.kw}</div>}
                    onRowClick={(e, model) => {
                        if (e.ctrlKey || e.metaKey || windowSize === 'desktop') {
                        } else if (e.altKey && model.isEditable) {
                            model.setEditing(true);
                        } else {
                            model.setExpanded(true);
                        }
                    }}
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
