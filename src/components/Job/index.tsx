import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import LazyDetails from '../shared/Details';
import { JobType } from '@site/src/models/Job';
import Summary from './Summary';
import Details from './Details';

interface Props {
    job: JobType;
}

const Job = observer((props: Props) => {
    const { job } = props;
    return (
        <LazyDetails
            className={clsx(styles.details)}
            summary={<Summary job={job} />}
        >
            <Details job={job} />
        </LazyDetails>
    )
});


export default Job;