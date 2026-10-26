import { translate } from '@docusaurus/Translate';
import EventsViewer, { View } from '@site/src/components/EventsViewer';
import ChangeViewAction from '@site/src/components/EventsViewer/ChangeViewAction';
import Delete from '@site/src/components/shared/Button/Delete';
import LazyDetails from '@site/src/components/shared/Details';
import { SIZE } from '@site/src/components/shared/icons';
import { formatDate } from '@site/src/models/helpers/time';
import User from '@site/src/models/User';
import { useStore } from '@site/src/stores/hooks';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { COLUMN_CONFIG } from '..';
import styles from '../styles.module.scss';
interface Props {
    viewType: View;
    onChangeView: (view: View) => void;
}

const JobTab = observer((props: Props) => {
    const { viewType } = props;
    const viewStore = useStore('viewStore');
    const jobStore = useStore('jobStore');

    if (jobStore.importJobs.length === 0) {
        return null;
    }

    return (
        <div className={clsx(styles.imports)}>
            {jobStore.importJobs.map((job, idx) => {
                const events = viewStore.allEvents({ jobId: job.id, orderBy: 'isValid-asc' });
                return (
                    <LazyDetails
                        key={job.id}
                        summary={
                            <summary>
                                {(job.user as User)?.email} - {job.filename || '|'} - {job.state} -{' '}
                                {events.length} - {formatDate(job.createdAt)}
                            </summary>
                        }
                    >
                        <div className={clsx(styles.imported)}>
                            <EventsViewer
                                events={events}
                                gridConfig={{
                                    columns: ['nr', ...COLUMN_CONFIG],
                                    className: clsx(styles.noMarginScrollContainer)
                                }}
                                bulkActionConfig={{
                                    className: styles.indent,
                                    rightActions: [
                                        <Delete
                                            onClick={() => {
                                                jobStore.destroy(job);
                                            }}
                                            text={translate({
                                                message: 'Job Löschen',
                                                id: 'components.event.usersevents.index.delete',
                                                description: 'Text to delete a job'
                                            })}
                                            flyoutSide="right"
                                            iconSide="right"
                                            size={SIZE}
                                            apiState={jobStore.apiStateFor(`destroy-${job.id}`)}
                                            key="action-r1"
                                        />,
                                        <ChangeViewAction
                                            viewType={viewType}
                                            setViewType={props.onChangeView}
                                            key="action-r2"
                                        />
                                    ]
                                }}
                                type={viewType}
                            />
                        </div>
                    </LazyDetails>
                );
            })}
        </div>
    );
});

export default JobTab;
