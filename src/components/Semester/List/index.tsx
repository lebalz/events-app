import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';

import styles from './styles.module.scss';
import EditTr from './editRow';
import Tr from './row';
import Translate from '@docusaurus/Translate';


interface Props {
}

const SemesterList = observer((props: Props) => {
    const store = useStore('semesterStore');
    return (
        <div>
            <table className={clsx(styles.table)}>
                <thead>
                    <tr>
                        <th>
                            <Translate
                                id="components.semestre.list.name"
                                description="The name of the column for the semester name"
                            >
                                Name
                            </Translate>
                        </th>
                        <th>
                            <Translate
                                id="components.semestre.list.startdate"
                                description="The name of the column for the start date of the semester"
                            >
                                Start Date
                            </Translate>
                        </th>
                        <th>
                            <Translate
                                id="components.semestre.list.enddate"
                                description="The name of the column for the end date of the semester"
                            >
                                End Date
                            </Translate>
                        </th>
                        <th>
                            <Translate
                                id="components.semestre.list.syncdate"
                                description="The name of the column for the date of sync semester"
                            >
                                Sync Date
                            </Translate>
                        </th>
                        <th>
                            <Translate
                                id="components.semestre.list.edit"
                                description="The name of the column for edit semester"
                            >
                                Edit
                            </Translate>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        store.semesters.map((semester, idx) => {
                            if (semester.isEditing) {
                                return <EditTr semester={semester} key={semester.id} />
                            }
                            return <Tr semester={semester} key={semester.id} />
                        })
                    }
                </tbody>
            </table>
        </div>
    )
});

export default SemesterList;