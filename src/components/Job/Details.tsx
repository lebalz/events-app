import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Job from '@site/src/models/Job';
import DefinitionList from '../shared/DefinitionList';
import { JobType } from '@site/src/api/job';
import CodeBlock from '@theme/CodeBlock';


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

export default Details;