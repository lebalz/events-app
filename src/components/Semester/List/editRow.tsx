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


interface Props {
    semester: Semester;
}

const EditTr = observer((props: Props) => {
    const { semester } = props;
    return (
        <tr className={clsx(styles.semester, semester.isDirty && styles.dirty)}>
            <td>
                <TextInput text={semester.name} onChange={(text) => { semester.update({ name: text }) }} />
            </td>
            <td>
                <DatePicker date={semester.start} onChange={(date) => { semester.update({ start: date.toISOString() }) }} />

            </td>
            <td>
                <DatePicker date={semester.end} onChange={(date) => { semester.update({ end: date.toISOString() }) }} />

            </td>
            <td>
                <div>
                    {semester.isDirty && (
                        <>
                            <Discard onClick={() => semester.reset()} />
                            <Save onClick={() => semester.save()} />
                        </>
                    )}
                    <Delete onClick={() => semester.destroy()} />
                </div>
            </td>
        </tr>
    )
});

export default EditTr;