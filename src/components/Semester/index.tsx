import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as SemesterModel } from '../../models/Semester';
import Alert from '../shared/Alert';
import Translate from '@docusaurus/Translate';

interface Props {
    semesterId: string;
}

const Semester = observer((props: Props) => {
    const store = useStore('semesterStore');
    const semester = store.find<SemesterModel>(props.semesterId);
    if (!semester) {
        return (
            <Alert type="danger">
                <Translate id="Semester.notFound">Das angegebene Semester wurde nicht gefunden.</Translate>
                ID: <code>{props.semesterId}</code>
            </Alert>
        );
    }
    return (
        <div className={clsx(styles.semester, semester.isDirty && styles.dirty)}>
            <h2>{semester.name}</h2>
            <div>{semester.fStartDate}</div>
            <div>{semester.fEndDate}</div>
        </div>
    );
});

export default Semester;
