import clsx from 'clsx';
import React from 'react';

import { translate } from '@docusaurus/Translate';
import { ImportJob as ImportJobModel } from '@site/src/models/Job';
import User from '@site/src/models/User';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import EventsViewer, { View } from '../EventsViewer';
import ChangeViewAction from '../EventsViewer/ChangeViewAction';
import Delete from '../shared/Button/Delete';
import LazyDetails from '../shared/Details';
import { Loading, SIZE } from '../shared/icons';
import styles from './styles.module.scss';

interface Props {
    job: ImportJobModel;
    summary?: string | React.ReactNode;
}

const ImportJob = observer((props: Props) => {
    const [viewType, setViewType] = React.useState<View>(View.Grid);
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
                <EventsViewer
                    bulkActionConfig={{
                        className: clsx(styles.bulkActions),
                        rightActions: [
                            <Delete
                                onClick={() => {
                                    jobStore.destroy(job);
                                }}
                                text={translate({
                                    id: 'job.delete',
                                    message: 'Job Löschen',
                                    description: 'job.delete'
                                })}
                                size={SIZE}
                                flyoutSide="right"
                                iconSide="right"
                                apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                key="action-r1"
                            />,
                            <ChangeViewAction viewType={viewType} setViewType={setViewType} key="action-r2" />
                        ]
                    }}
                    events={job.events}
                    type={viewType}
                    gridConfig={{
                        defaultSortBy: 'nr',
                        columns: [
                            'nr',
                            'isValid',
                            'isDuplicate',
                            'select',
                            ['state', { sortable: true, width: undefined }],
                            ['teachingAffected', { componentProps: { show: 'icon' } }],
                            'kw',
                            'day',
                            'description',
                            'start',
                            'end',
                            ['userGroup', { sortable: false }],
                            'location',
                            'departments',
                            'classes',
                            'descriptionLong',
                            'linkedUsers',
                            ['actions', { fixed: { right: 0 } }]
                        ]
                    }}
                />
            </div>
        </LazyDetails>
    );
});

export default ImportJob;
