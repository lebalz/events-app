import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Job, {ImportJob, JobType as JobModel, SyncJob} from '@site/src/models/Job';
import { JobType, JobState } from '@site/src/api/job';
import StateBadge from '../shared/Badge/StateBadge';
import Button from '../shared/Button';
import Delete from '../shared/Button/Delete';
import { SIZE_S, Sync } from '../shared/icons';
import Badge from '../shared/Badge';
import { Color as ColorType } from '../shared/Colors';



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

interface ImportProps {
    job: ImportJob;
}

export const ImportSummary = observer((props: ImportProps) => {
    const { job } = props;
    return (
        <summary className={clsx(styles.summary)}>
            <StateBadge state={State[job.state]} size={SIZE_S} />
            <Badge text={Text[job.type]} color={Color[job.type]} />
            <Badge text={job.createdAt.toLocaleDateString()} />
            <div className={clsx(styles.spacer)} />
            {job.type === JobType.IMPORT && <Badge text={`${job.events.length}`} color="blue" />}
            <div className={clsx(styles.spacer)} />
            <Delete
                onClick={() => {
                    job.destroy();
                }}
                apiState={job.apiState(`destroy-${job.id}`)}
                disabled={job.state === JobState.PENDING}
            />
        </summary>
    )
});


interface SyncProps {
    job: SyncJob;
}
export const SyncSummary = observer((props: SyncProps) => {
    const semesterStore = useStore('semesterStore');
    const jobStore = useStore('jobStore');
    const { job } = props;
    const isPending = (jobStore.bySemester(job.semesterId) || []).some(j => j.state === JobState.PENDING);
    return (
        <summary className={clsx(styles.summary)}>
            <StateBadge state={State[job.state]} size={SIZE_S} disabled={!job.isInSync} />
            <Badge text={Text[job.type]} color={Color[job.type]}  disabled={!job.isInSync}/>
            <Badge text={job.createdAt.toLocaleDateString()} />
            <div className={clsx(styles.spacer)} />
            <Badge text={`${job.semester?.name}`} color="blue" />
            <div className={clsx(styles.spacer)} />
            {job.isLatest && (
                <Button
                    disabled={isPending}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (job.semester) {
                            semesterStore.syncUntis(job.semester);
                        }
                        return false;
                    }}
                    text="Sync Untis"
                    icon={<Sync spin={isPending} />}
                    color={job.isInSync ? "primary" : "black"}
                />
            )}
        </summary>
    )
});