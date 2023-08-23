import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import EventGrid from '../components/Event/EventGrid';
import Button from '../components/shared/Button';
import { mdiDownloadCircleOutline, mdiTools } from '@mdi/js';
import {useWindowSize} from '@docusaurus/theme-common';
import Filter from '../components/Event/Filter';
import clsx from 'clsx';
import styles from './table.module.scss';

const Table = observer(() => {
    const viewStore = useStore('viewStore');
    const eventStore = useStore('eventStore');
    const windowSize = useWindowSize();
    return (
        <Layout>
            <div className={clsx(styles.table)}>
                <Filter showCurrentAndFuture/>
                <EventGrid 
                    events={viewStore.eventTable.events}
                    groupBy='yearsKw'
                    columns={[
                      'day',
                      'description', 
                      'start',
                      'end',
                      'location',
                      'departmens',
                      'classes',
                      'descriptionLong',
                      ['actions', {fixed: {right: 0}}]
                    ]}
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
