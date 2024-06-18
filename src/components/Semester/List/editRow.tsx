import React, { type ReactNode } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import Semester from '@site/src/models/Semester';
import TextInput from '../../shared/TextInput';
import DatePicker from '../../shared/DatePicker';
import Delete from '../../shared/Button/Delete';
import Discard from '../../shared/Button/Discard';
import Save from '../../shared/Button/Save';
import Badge from '../../shared/Badge';
import { mdiAlertOutline } from '@mdi/js';

interface Props {
    semester: Semester;
}

const EditTr = observer((props: Props) => {
    const { semester } = props;
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [ref]);
    return (
        <tr className={clsx(styles.semester, semester.isDirty && styles.dirty)}>
            <td>
                <TextInput
                    text={semester.name}
                    onChange={(text) => {
                        semester.update({ name: text });
                    }}
                />
            </td>
            <td>
                <DatePicker
                    time="start"
                    date={semester.start}
                    onChange={(date) => {
                        semester.update({ start: date.toISOString() });
                    }}
                />
            </td>
            <td>
                <DatePicker
                    time="end"
                    date={semester.end}
                    onChange={(date) => {
                        semester.update({ end: date.toISOString() });
                    }}
                />
            </td>
            <td>
                <div className={clsx(styles.syncDate)}>
                    {!semester.isSyncdateWithinSemester && (
                        <Badge
                            icon={mdiAlertOutline}
                            color="orange"
                            title="Das Synchronisationsdatum liegt nicht im Semester"
                        />
                    )}
                    <DatePicker
                        time="start"
                        date={semester.untisSyncDate}
                        onChange={(date) => {
                            semester.update({ untisSyncDate: date.toISOString() });
                        }}
                    />
                </div>
            </td>
            <td>
                <div ref={ref}>
                    <Discard onClick={() => semester.reset()} />
                    <Save
                        disabled={!semester.isDirty}
                        onClick={() => semester.save()}
                        apiState={semester.apiStateFor(`save-${semester.id}`)}
                    />
                    <Delete
                        onClick={() => semester.destroy()}
                        flyoutSide="left"
                        apiState={semester.apiStateFor(`destroy-${semester.id}`)}
                    />
                </div>
            </td>
        </tr>
    );
});

export default EditTr;
