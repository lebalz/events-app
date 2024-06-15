import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import LazyDetails from '../shared/Details';
import User from '@site/src/models/User';
import Delete from '../shared/Button/Delete';
import BulkActions from '../Event/BulkActions';
import Grid from '../Event/Views/Grid';
import { ImportJob as ImportJobModel } from '@site/src/models/Job';
import Translate, { translate } from '@docusaurus/Translate';
import { Loading } from '../shared/icons';


interface Props {
    job: ImportJobModel;
    summary?: string | React.ReactNode;
}

const ImportJob = observer((props: Props) => {
    const jobStore = useStore('jobStore');
    const { job } = props;
    return (
        <LazyDetails
            summary={
                <summary>
                    {props.summary ?? `${(job.user as User)?.email} - ${job.filename || '|'} - ${job.state}`}
                    {job.isLoadingEvents && <Loading />}
                </summary>
            }
            onOpenChange={(open) => {
                if (open) {
                    job.loadEvents();
                }
            }}
            className={clsx(styles.job)}
        >
            <div>
                <BulkActions 
                    events={job.events}
                    defaultActions={
                        <Delete
                            onClick={() => {
                                jobStore.destroy(job);
                            }}
                            text={translate({
                                id: 'job.delete',
                                message: 'Job Löschen',
                                description: 'job.delete'
                            })}
                            flyoutSide='right'
                            iconSide='right'
                            apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                        />
                    }
                />
                <Grid 
                    events={job.events}
                    defaultSortBy='nr'
                    columns={[
                        'nr',
                        'isValid',
                        'isDuplicate',
                        'select',
                        ['state', {sortable: false, width: undefined}],
                        ['teachingAffected', {componentProps: {show: 'icon'}}],
                        'kw',
                        'day',
                        'description', 
                        'start',
                        'end',
                        ['userGroup', {sortable: false}],
                        'location',
                        'departmens',
                        'classes',
                        'descriptionLong',
                        ['actions', {fixed: {right: 0}}]
                    ]}
                />
            </div>
        </LazyDetails>
    )
});

export default ImportJob;