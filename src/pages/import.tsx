import Layout from '@theme/Layout';
import React from 'react';
import styles from './import.module.scss';
import clsx from 'clsx';
import Upload from '../components/ImportExcel/Upload';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { JobState, JobType } from '../api/job';
import Delete from '../components/shared/Button/Delete';
import LazyDetails from '../components/shared/Details';
import CodeBlock from '@theme/CodeBlock';

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
            {jobStore.models.map((job, idx) => {
                return (
                    <LazyDetails
                        key={idx}
                        summary={
                            <summary className={clsx(styles.alert)}>
                                {job.type === JobType.SYNC_UNTIS && (
                                    `${StateSymbol[job.state]} Sync Untis: ${job.createdAt.toLocaleString()}-${job.updatedAt.toLocaleTimeString()}`
                                )}
                                {job.type === JobType.IMPORT && (
                                    `${StateSymbol[job.state]} Import....: ${job.createdAt.toLocaleString()}-${job.updatedAt.toLocaleTimeString()} -> ${job.events.length}`
                                )}
                                <div className={clsx(styles.spacer)} />
                                <Delete
                                    onClick={() => {
                                        jobStore.destroy(job);
                                    }}
                                />
                            </summary>
                        }
                    >
                        <div>
                            <div>
                                <dl>
                                    <dt>Id</dt>
                                    <dd>{job.id}</dd>
                                    <dt>State</dt>
                                    <dd>{job.state}</dd>
                                    <dt>Filename</dt>
                                    <dd>{job.filename}</dd>
                                    <dt>Events</dt>
                                    <dd>{job.events.length}</dd>
                                    <dt>Created At</dt>
                                    <dd>{job.createdAt.toLocaleString()}</dd>
                                    <dt>Updated At</dt>
                                    <dd>{job.updatedAt.toLocaleString()}</dd>
                                </dl>
                            </div>
                            <CodeBlock language='json' title='log.json'>
                                {job.fLog}
                            </CodeBlock>
                        </div>
                    </LazyDetails>
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