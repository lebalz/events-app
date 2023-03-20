import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';

import styles from './styles.module.scss';
import Button from '../../shared/Button';
import Edit from '../../shared/Button/Edit';
import Delete from '../../shared/Button/Delete';
import Save from '../../shared/Button/Save';
import Discard from '../../shared/Button/Discard';
import DatePicker from '../../shared/DatePicker';
import TextInput from '../../shared/TextInput';


interface Props {
}

const SemesterList = observer((props: Props) => {
    const store = useStore('semesterStore');
    return (
        <div>
            <table className={clsx(styles.table)}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        store.semesters.map((semester, idx) => (
                            <tr key={idx} className={clsx(styles.semester, semester.isDirty && styles.dirty)}>
                                <td>{
                                semester.editing ? (
                                    <TextInput text={semester.name} onChange={(text) => {semester.update({name: text})}} />
                                ) : (
                                    semester.name
                                )}</td>
                                <td>{
                                    semester.editing ? (
                                        <DatePicker date={semester.start} onChange={(date) => {semester.update({start: date.toISOString()})}} />
                                    ) : (
                                        semester.fStartDate
                                    )
                                }</td>
                                <td>{
                                    semester.editing ? (
                                        <DatePicker date={semester.end} onChange={(date) => {semester.update({end: date.toISOString()})}} />
                                    ) : (
                                        semester.fEndDate
                                    )
                                }</td>
                                <td>
                                    <div>
                                        {semester.isDirty && (
                                            <Save onClick={() => semester.save()} />
                                        )}
                                        {semester.editing && (
                                            <Discard onClick={() => semester.reset()} />
                                        )}
                                        {semester.editing && (
                                            <Delete onClick={() => semester.destroy()} />
                                        )}
                                        {!semester.editing && (
                                            <Edit onClick={() => semester.setEditing(true)} />
                                        )}

                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
});

export default SemesterList;