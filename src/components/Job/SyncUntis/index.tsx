import { translate } from '@docusaurus/Translate';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Section from '../../shared/Section';
import SyncSemester from './SyncSemester';

interface Props {}

const SyncUntis = observer((props: Props) => {
    const semesterStore = useStore('semesterStore');
    return (
        <Section
            title={translate({
                id: 'job.SyncUntis.section.title',
                message: 'Stundenpläne Synchronisieren (WebUntis)',
                description: 'Title of the section syncUntis'
            })}
            subtitle={translate({
                id: 'job.SyncUntis.section.subtitle',
                message: 'Synchronisiere die Stundenpläne, Klassen und Lehrpersonen von WebUntis.',
                description: 'Subtitle of the section syncUntis'
            })}
        >
            {semesterStore.semesters.map((semester, idx) => {
                return <SyncSemester key={semester.id} semester={semester} />;
            })}
        </Section>
    );
});

export default SyncUntis;
