import Layout from '@theme/Layout';
import React from 'react';
import Upload from '../components/ImportExcel/Upload';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import { Icon } from '../components/shared/icons';
import { mdiFileExcel } from '@mdi/js';
import Section from '../components/shared/Section';
import Job from '../components/Job';
import { translate } from '@docusaurus/Translate';

const Example = observer(() => {
    const semesterStore = useStore('semesterStore');
    const viewStore = useStore('viewStore');
    const jobStore = useStore('jobStore');

    return (
        <Layout>
            <Section
                title={<span>{translate({
                    message : "Excel Import",
                    id:'import.section.title' ,
                    description:'import.section.title'})}
                     <Icon path={mdiFileExcel} size={2} color={'green'} /></span>}
                subtitle={translate({
                    message : "Importiere Daten aus Excel-Dateien.",
                    id:'import.section.subtitle' ,
                    description:'import.section.subtitle'})}
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