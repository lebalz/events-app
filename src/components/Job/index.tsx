import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import LazyDetails from '../shared/Details';
import { JobType as JobTypeModel } from '@site/src/models/Job';
import {ImportSummary, SyncSummary} from './Summary';
import Details from './Details';
import { JobType } from '@site/src/api/job';

interface Props {
    job: JobTypeModel;
}

const JobSummary = observer((props: Props) => {
    const { job } = props;
    switch (job.type) {
        case JobType.IMPORT:
            return <ImportSummary job={job} />;
        case JobType.SYNC_UNTIS:
            return <SyncSummary job={job} />;
    }
    return null;
});

const Job = observer((props: Props) => {
    const { job } = props;
    return (
        <LazyDetails
            className={clsx(styles.details)}
            summary={<JobSummary job={job} />}
        >
            <Details job={job} />
        </LazyDetails>
    )
});


export default Job;