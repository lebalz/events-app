import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Section from '../shared/Section';
import Translate, { translate } from '@docusaurus/Translate';
import { Icon } from '../shared/icons';
import { mdiFileExcel, mdiFileImport } from '@mdi/js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { ImportType } from '@site/src/api/event';
import Upload from './Upload';
import Job from '../Job';


interface Props {
}

const ImportEvents = observer((props: Props) => {
    const jobStore = useStore('jobStore');

    return (
        <Section
            title={
                <span>
                    <Icon path={mdiFileImport} size={2} color={'var(--ifm-color-primary)'} />
                    <Translate id="import.section.title" description="import.section.title">
                        Datei Importieren
                    </Translate>
                </span>}
            subtitle={translate({
                message: "Importiere Daten aus Excel-Dateien.",
                id: 'import.section.subtitle',
                description: 'import.section.subtitle'
            })}
        >
            <Tabs lazy>
                <TabItem
                    value="gbsl"
                    label={translate({ id: 'import.tab.gbsl.label', message: 'GBSL Import', description: 'import.tab.gbsl' })}
                >
                    <Upload type={ImportType.GBSL_XLSX} />
                </TabItem>
                <TabItem
                    value="gbjb"
                    label={translate({ id: 'import.tab.gbjb.label', message: 'GBJB Import', description: 'import.tab.gbjb' })}
                >
                    <Upload type={ImportType.GBJB_CSV} />
                </TabItem>
            </Tabs>
            <div>
                {jobStore.importJobs.map((job, idx) => {
                    return (
                        <Job key={job.id} job={job} />
                    )
                })}
            </div>
        </Section>
    )
});

export default ImportEvents;