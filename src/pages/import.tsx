import Layout from '@theme/Layout';
import React from 'react';
import styles from './import.module.scss';
import clsx from 'clsx';
import Upload from '../components/ImportExcel/Upload';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { JobState, JobType } from '../api/job';

const StateSymbol = {
    [JobState.PENDING]: '🏃',
    [JobState.DONE]: '✅',
    [JobState.ERROR]: '❌',
}

const Example = observer(() => {
    const untisStore = useStore('untisStore');
    const jobStore = useStore('jobStore');

    return (<Layout>
        <div>
            <Upload />
        </div>
        <div>
            {jobStore.jobs.map((job, idx) => {
                return (
                    <div className={clsx('alert', 'alert--info')} style={{fontFamily: 'monospace', marginBottom: '0.5rem'}} role="alert" key={idx}>
                        <button aria-label="Close" className="clean-btn close" type="button" onClick={
                            () => {
                                jobStore.destroy(job);
                            }
                        }>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {job.type === JobType.SYNC_UNTIS && (
                            `Sync Untis: ${job.createdAt.toLocaleString()}-${job.updatedAt.toLocaleTimeString()} ${StateSymbol[job.state]}}`
                        )}
                        {job.type === JobType.IMPORT && (
                            `Import....: ${job.createdAt.toLocaleString()}-${job.updatedAt.toLocaleTimeString()}: ${StateSymbol[job.state]} "${job.filename}" -> ${job.events.length}`
                        )}
                    </div>
                )
            })}
        </div>

        <div 
            className={clsx('button', 'button--primary')}
            onClick={() => {
                console.log('Sync Untis');
                untisStore.sync()
            }}
        >
            Sync Untis
        </div>
    </Layout >)
});

export default Example;