import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Section from '../../shared/Section';
import SyncSemester from './SyncSemester';


interface Props {
}

const SyncUntis = observer((props: Props) => {
    const semesterStore = useStore('semesterStore');
    return (
        <Section
            title="Stundenpläne Synchronisieren (WebUntis)"
            subtitle="Synchronisiere die Stundenpläne, Klassen und Lehrpersonen von WebUntis."
        >
            {
                semesterStore.semesters.map((semester, idx) => {
                    return (
                        <SyncSemester key={semester.id} semester={semester} />
                    );
                })
            }
        </Section>
    )
});

export default SyncUntis;


