import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';
import Layout from '@theme/Layout';
import Semester from '../components/Semester';
import clsx from 'clsx';
import { toGlobalDate } from '../models/helpers/time';

const Table = observer(() => {
    const store = useStore('semesterStore');
    return (
        <Layout>
            <button 
                className={clsx('button--primary', 'button')}
                onClick={() => {
                    const now = toGlobalDate(new Date());
                    const t1 = new Date(now);
                    t1.setHours(t1.getHours() + 1);
                    store.create({ name: 'FS23', start: now.toISOString(), end: t1.toISOString() })
                }}
            >
                Add Semester
            </button>
            <div>
                {store.semesters.map((semester) => (
                    <Semester semesterId={semester.id} />
                ))}
            </div>
        </Layout>
    );
});

export default Table;
