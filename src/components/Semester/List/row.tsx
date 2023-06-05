import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Semester from '@site/src/models/Semester';
import Edit from '../../shared/Button/Edit';
import { Icon } from '../../shared/icons';
import Badge from '../../shared/Badge';
import { mdiAlertOutline } from '@mdi/js';


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
            <td>
                <div className={clsx(styles.syncDate)}>
                    {!semester.isSyncdateWithinSemester && (<Badge icon={mdiAlertOutline} color='orange' title='Das Synchronisationsdatum liegt nicht im Semester' />)}
                    {semester.fUntisSyncDate}
                </div>
            </td>
            <td><Edit onClick={() => semester.setEditing(true)} /></td>
        </tr>
    )
});

export default Tr;