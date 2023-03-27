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
import { Error, Success, Loading, SIZE_S, SIZE, SIZE_XS, Icon, Sync } from '../components/shared/icons';
import Badge, { Color as ColorType } from '../components/shared/Badge';
import StateBadge from '../components/shared/Badge/StateBadge';
import { mdiCircle, mdiFileExcel } from '@mdi/js';
import DefinitionList from '../components/shared/DefinitionList';
import { default as JobModel } from '../models/Job';
import Button from '../components/shared/Button';
import Section from '../components/shared/Section';

const State: { [key in JobState]: 'loading' | 'success' | 'error' } = {
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

const JobSummary = observer((props: { job: JobModel }) => {
    const untisStore = useStore('untisStore');
    const jobStore = useStore('jobStore');
    const { job } = props;
    return (
        <summary className={clsx(styles.summary)}>
        <StateBadge state={State[job.state]} size={SIZE_S} />
        <Badge text={Text[job.type]} color={Color[job.type]} />
        <Badge text={job.createdAt.toLocaleDateString()} />
        <div className={clsx(styles.spacer)} />
        {job.type === JobType.IMPORT && <Badge text={`${job.events.length}`} color="blue" />}
        <div className={clsx(styles.spacer)} />
        {job.type === JobType.IMPORT && (
            <Delete
                onClick={() => {
                    job.destroy();
                }}
                apiState={job.apiState(`destroy-${job.id}`)}
                disabled={job.state === JobState.PENDING}
            />
        )}
        {job.type === JobType.SYNC_UNTIS && job.id === jobStore.syncJobs[0].id && (
            <Button
                disabled={jobStore.hasPendingSyncJobs}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    untisStore.sync()
                    return false;
                }}
                text="Sync Untis"
                icon={<Sync spin={jobStore.hasPendingSyncJobs}/>}
                className="button--primary"
            />
        )}
    </summary>
    )  
})

const JobDetails = observer((props: { job: JobModel }) => {
    const { job } = props;
    return (
        <div>
            <div>
                <DefinitionList>
                    <dt>Id</dt>
                    <dd>{job.id}</dd>
                    <dt>State</dt>
                    <dd>{job.state}</dd>
                    {job.type === JobType.IMPORT && (
                        <>
                            <dt>Filename</dt>
                            <dd>{job.filename}</dd>
                            <dt>Events</dt>
                            <dd>{job.events.length}</dd>
                        </>
                    )}
                    <dt>Created At</dt>
                    <dd>{job.createdAt.toLocaleString()}</dd>
                    <dt>Updated At</dt>
                    <dd>{job.updatedAt.toLocaleString()}</dd>
                </DefinitionList>
            </div>
            {job.fLog.length > 0 && (
                <CodeBlock language='json' title='log.json'>
                    {job.fLog}
                </CodeBlock>
            )}
        </div>
    )
})

const Job = observer((props: { job: JobModel }) => {
    const { job } = props;
    return (
        <LazyDetails
            className={clsx(styles.details)}
            summary={<JobSummary job={job} />}
        >
            <JobDetails job={job} />
        </LazyDetails>
    )
});

const Example = observer(() => {
    const untisStore = useStore('untisStore');
    const jobStore = useStore('jobStore');

    return (<Layout>
        
        <Section
            title="Sync Untis"
            subtitle="Synchronisiere die Stundenpläne, Klassen und Lehrpersonen von WebUntis."
        >
            {jobStore.syncJobs.length > 0 ? (
                <LazyDetails
                    className={clsx(styles.details)}
                    summary={<JobSummary job={jobStore.syncJobs[0]} />}
                >
                    <div>
                        <JobDetails job={jobStore.syncJobs[0]} />
                        {jobStore.syncJobs.slice(1).map((job, idx) => {
                            return (
                                <Job key={idx} job={job} />
                            )
                        })}
                    </div>
                </LazyDetails>
            ) : (
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        untisStore.sync();
                    }}
                    text="Sync Untis"
                    icon={<Sync spin={jobStore.hasPendingSyncJobs}/>}
                    className="button--primary"
                />            
            )}

        </Section>

        <Section
            title={<span>Excel Import <Icon path={mdiFileExcel} size={2} color={'green'} /></span>}
            subtitle="Importiere Daten aus Excel-Dateien."
        >
            <Upload />
            <div>
                {jobStore.importJobs.map((job, idx) => {
                    return (
                        <Job key={job.id} job={job} />
                    )
                })}
            </div>
        </Section>
    </Layout >)
});

export default Example;