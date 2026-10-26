import clsx from 'clsx';

import { mdiAlertOutline } from '@mdi/js';
import Semester from '@site/src/models/Semester';
import { observer } from 'mobx-react-lite';
import Badge from '../../shared/Badge';
import Edit from '../../shared/Button/Edit';
import styles from './styles.module.scss';

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
                    {!semester.isSyncdateWithinSemester && (
                        <Badge
                            icon={mdiAlertOutline}
                            color="orange"
                            title="Das Synchronisationsdatum liegt nicht im Semester"
                        />
                    )}
                    {semester.fUntisSyncDate}
                </div>
            </td>
            <td>
                <Edit onClick={() => semester.setEditing(true)} />
            </td>
        </tr>
    );
});

export default Tr;
