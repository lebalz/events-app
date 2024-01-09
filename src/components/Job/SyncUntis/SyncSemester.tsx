import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Semester from '@site/src/models/Semester';
import LazyDetails from '../../shared/Details';
import {SyncSummary} from '../Summary';
import Details from '../Details';
import Job from '..';
import { JobState } from '@site/src/api/job';
import { Sync } from '../../shared/icons';
import Button from '../../shared/Button';
import Badge from '../../shared/Badge';
import Translate, { translate } from '@docusaurus/Translate';


interface Props {
    semester: Semester;
}

const SyncSemester = observer((props: Props) => {
    const {semester} = props;
    const semesterStore = useStore('semesterStore');
    const jobStore = useStore('jobStore');
    const isPending = (jobStore.bySemester(semester.id) || []).some(j => j.state === JobState.PENDING);
    return (
        <div className={clsx(styles.syncSemester)}>
            {semester.untisSyncJobs.length > 0 ? (
                <LazyDetails
                    className={clsx(styles.details)}
                    summary={<SyncSummary job={semester.untisSyncJobs[0]} />}
                >
                    <div>
                        <Details job={semester.untisSyncJobs[0]} />
                        {semester.untisSyncJobs.slice(1).map((job, idx) => {
                            return (
                                <Job key={idx} job={job} />
                            )
                        })}
                    </div>
                </LazyDetails>
            ) : (
                <LazyDetails
                    className={clsx(styles.details)}
                    summary={
                        <summary className={clsx(styles.summary)}>
                            <Badge text={translate({ id: 'job.SyncUntis.badge.text', message: 'Sync Untis', description: 'Text of the badge for sync Untis' })} color="orange" />
                            <div className={clsx(styles.spacer)} />
                                <Badge text={`${semester.name}`} color="blue" />
                            <div className={clsx(styles.spacer)} />
                            <Button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    semesterStore.syncUntis(semester);
                                }}
                                disabled={jobStore.hasPendingSyncJobs}
                                text={translate({ id: 'job.SyncUntis.button.text', message: 'Sync Untis', description: 'Text of the button for sync Untis' })}
                                icon={<Sync spin={isPending} />}
                                className="button--primary"
                            />
                        </summary>
                    }
                >
                    <div>                        
                    </div>
                </LazyDetails>
            )}
        </div>
    )
});

export default SyncSemester;