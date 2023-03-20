import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';

import styles from './styles.module.scss';
import EditTr from './editRow';
import Tr from './row';


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
                        store.semesters.map((semester, idx) => {
                            if (semester.editing) {
                                return <EditTr semester={semester} key={idx} />
                            }
                            return <Tr semester={semester} key={idx} />
                        })
                    }
                </tbody>
            </table>
        </div>
    )
});

export default SemesterList;