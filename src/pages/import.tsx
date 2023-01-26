import Layout from '@theme/Layout';
import React from 'react';
import styles from './import.module.scss';
import clsx from 'clsx';
import Upload from '../components/ImportExcel/Upload';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';

const Example = observer(() => {
    const untisStore = useStore('untisStore');
    const jobStore = useStore('jobStore');

    return (<Layout>
        <div>
            <Upload />
        </div>
        <div>
            {jobStore.jobs.map((job) => {
                return (
                    <div className={clsx('alert', 'alert--info')} role="alert">
                        <button aria-label="Close" className="clean-btn close" type="button" onClick={
                            () => {
                                jobStore.destroy(job);
                            }
                        }>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        {job.user.email} - {job.state} - {job.events.length}
                    </div>
                )
            })}
        </div>

        <div 
            className={clsx('button', 'button--primary')}
            onClick={() => {
                console.log('Sync Untis');
                untisStore.sync()
            }}
        >
            Sync Untis
        </div>
    </Layout >)
});

export default Example;