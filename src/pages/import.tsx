import Layout from '@theme/Layout';
import React from 'react';
import styles from './import.module.scss';
import clsx from 'clsx';
import Upload from '../components/ImportExcel/Upload';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import LazyDetails from '../components/shared/Details';
import { Icon, Sync } from '../components/shared/icons';
import { mdiFileExcel } from '@mdi/js';
import Button from '../components/shared/Button';
import Section from '../components/shared/Section';
import Summary from '../components/Job/Summary';
import Details from '../components/Job/Details';
import Job from '../components/Job';

const Example = observer(() => {
    const semesterStore = useStore('semesterStore');
    const viewStore = useStore('viewStore');
    const jobStore = useStore('jobStore');

    return (
        <Layout>
            <Section
                title="Sync Untis"
                subtitle="Synchronisiere die Stundenpläne, Klassen und Lehrpersonen von WebUntis."
            >
                {
                    semesterStore.semesters.map((semester, idx) => {
                        return (
                            <React.Fragment key={semester.id}>
                                {semester.untisSyncJobs.length > 0 ? (
                                    <LazyDetails
                                        className={clsx(styles.details)}
                                        summary={<Summary job={semester.untisSyncJobs[0]} />}
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
                                    <Button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            semesterStore.syncUntis(semester);
                                        }}
                                        text="Sync Untis"
                                        icon={<Sync spin={jobStore.hasPendingSyncJobs} />}
                                        className="button--primary"
                                    />
                                )}
                            </React.Fragment>
                        );
                    })
                }
            </Section>
            <Section
                title={<span>Excel Import <Icon path={mdiFileExcel} size={2} color={'green'} /></span>}
                subtitle="Importiere Daten aus Excel-Dateien."
            >
                <Upload />
                <div>
                    {jobStore.importJobs.map((job, idx) => {
                        return (
                            <Job key={job.id} job={job} />
                        )
                    })}
                </div>
            </Section>
        </Layout >
    );
});

export default Example;