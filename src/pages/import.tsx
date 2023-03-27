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
import { Error, Success, Loading, SIZE_S, SIZE, SIZE_XS, Icon } from '../components/shared/icons';
import Badge, { Color as ColorType } from '../components/shared/Badge';
import StateBadge from '../components/shared/Badge/StateBadge';
import { mdiCircle } from '@mdi/js';

const State: { [key in JobState]: 'loading' | 'success' | 'error'} = {
    [JobState.PENDING]: 'loading',
    [JobState.DONE]: 'success',
    [JobState.ERROR]: 'error',
    [JobState.REVERTED]: 'loading'
}

const Text: { [key in JobType]: string } = {
    [JobType.SYNC_UNTIS]: 'Sync Untis',
    [JobType.IMPORT]: 'Import',
    [JobType.CLONE]: 'Klonen',
}

const Color: { [key in JobType]: ColorType } = {
    [JobType.SYNC_UNTIS]: 'orange',
    [JobType.IMPORT]: 'blue',
    [JobType.CLONE]: 'lightBlue',
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
                        className={clsx(styles.details)}
                        summary={
                            <summary className={clsx(styles.summary)}>
                                <StateBadge state={State[job.state]} size={SIZE_S}/>
                                <Badge text={Text[job.type]} color={Color[job.type]}/>
                                <Badge text={job.createdAt.toLocaleDateString()} />
                                <div className={clsx(styles.spacer)} />
                                {job.type === JobType.IMPORT && <Badge text={`${job.events.length}`} color="blue" />}
                                <div className={clsx(styles.spacer)} />
                                <Delete
                                    onClick={() => {
                                        jobStore.destroy(job);
                                    }}
                                    apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                    disabled={job.state === JobState.PENDING || job.type !== JobType.IMPORT}
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