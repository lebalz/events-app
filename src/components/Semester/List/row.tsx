import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Semester from '@site/src/models/Semester';
import Edit from '../../shared/Button/Edit';


interface Props {
    semester: Semester;
}

const Tr = observer((props: Props) => {
    const { semester } = props;
    return (
        <tr className={clsx(styles.semester, semester.isDirty && styles.dirty)}>
            <td>{semester.name}</td>
            <td>{semester.fStartDate}</td>
            <td>{semester.fEndDate}</td>
            <td><Edit onClick={() => semester.setEditing(true)} /></td>
        </tr>
    )
});

export default Tr;