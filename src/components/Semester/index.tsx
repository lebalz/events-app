import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as SemesterModel } from '../../models/Semester';

interface Props {
    semsesterId: string;
}

const Semester = observer((props: Props) => {
    const store = useStore('semesterStore');
    const semester = store.find<SemesterModel>(props.semsesterId);
    return (
        <div className={clsx(styles.semester)}>
            <h2>{semester.name}</h2>
            <div>{semester.fStartDate}</div>
            <div>{semester.fEndDate}</div>
        </div>
    )
});

export default Semester;