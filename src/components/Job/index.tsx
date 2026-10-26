import { JobType } from '@site/src/api/job';
import { JobType as JobTypeModel } from '@site/src/models/Job';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import LazyDetails from '../shared/Details';
import Details from './Details';
import styles from './styles.module.scss';
import { ImportSummary, SyncSummary } from './Summary';

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
        <LazyDetails className={clsx(styles.details)} summary={<JobSummary job={job} />}>
            <Details job={job} />
        </LazyDetails>
    );
});

export default Job;
