

import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import LazyDetails from '../shared/Details';
import User from '@site/src/models/User';
import Delete from '../shared/Button/Delete';
import BulkActions from '../Event/BulkActions';
import EventGrid from '../Event/EventGrid';
import gImport from '../Event/EventGrid/gridConfigs/import_job.module.scss';
import { ImportJob as ImportJobModel } from '@site/src/models/Job';


interface Props {
    job: ImportJobModel;
    summary?: string | React.ReactNode;
}

const ImportJob = observer((props: Props) => {
    const jobStore = useStore('jobStore');
    const { job } = props;
    return (
        <LazyDetails
            summary={
                <summary>
                    {props.summary ?? `${(job.user as User)?.email} - ${job.filename || '|'} - ${job.state} - ${job.events.length}`}
                </summary>
            }
        >
            <div>
                <Delete
                    onClick={() => {
                        jobStore.destroy(job);
                    }}
                    text="Job Löschen"
                    flyoutSide='right'
                    iconSide='right'
                    apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                />
                <BulkActions events={job.events.filter(e => e.selected)} />
                <EventGrid events={job.events} showFullscreenButton={false} gridConfig={gImport.grid} selectable />
            </div>
        </LazyDetails>
    )
});

export default ImportJob;