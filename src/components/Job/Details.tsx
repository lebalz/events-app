import { JobType } from '@site/src/api/job';
import Job, { ImportJob as ImportJobModel, SyncJob } from '@site/src/models/Job';
import CodeBlock from '@theme/CodeBlock';
import { observer } from 'mobx-react-lite';
import Badge from '../shared/Badge';
import Button from '../shared/Button';
import DefinitionList from '../shared/DefinitionList';
import ImportJob from './ImportJob';

interface Props {
    job: Job;
}

const Details = observer((props: Props) => {
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
                            <dd>{(job as ImportJobModel).filename}</dd>
                            <dt>Events</dt>
                            <dd>
                                {(job as ImportJobModel).fullyLoaded ? (
                                    <Badge
                                        text={`${(job as ImportJobModel).events.length}`}
                                        color="primary"
                                    />
                                ) : (
                                    <Button
                                        text="Laden"
                                        onClick={() => (job as ImportJobModel).loadEvents()}
                                        color="primary"
                                    />
                                )}
                            </dd>
                        </>
                    )}
                    {job.type === JobType.SYNC_UNTIS && (
                        <>
                            <dt>Sync Date</dt>
                            <dd>{(job as SyncJob).fSyncDate}</dd>
                        </>
                    )}
                    {job.user && (
                        <>
                            <dt>Author</dt>
                            <dd>{job.user?.fullName}</dd>
                        </>
                    )}
                    <dt>Created At</dt>
                    <dd>{job.createdAt.toLocaleString()}</dd>
                    <dt>Updated At</dt>
                    <dd>{job.updatedAt.toLocaleString()}</dd>
                </DefinitionList>
            </div>
            {job.fLog.length > 0 && (
                <CodeBlock language="json" title="log.json">
                    {job.fLog}
                </CodeBlock>
            )}
            {job.type === JobType.IMPORT && (job as ImportJobModel).events.length > 0 && (
                <ImportJob job={job as ImportJobModel} />
            )}
        </div>
    );
});

export default Details;
