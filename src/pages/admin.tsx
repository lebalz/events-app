import React from 'react';
import clsx from 'clsx';
import styles from './admin.module.scss';
import { observer } from 'mobx-react-lite';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '../stores/hooks';
import Semester from '../components/Semester';
import SemesterList from '../components/Semester/List';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/icons';
import { mdiFileExcel, mdiPlusCircleOutline } from '@mdi/js';
import UserTable from '../components/Admin/UserTable';
import DepartmentTable from '../components/Admin/DepartmentTable';
import { Role } from '../api/user';
import SyncUntis from '../components/Job/SyncUntis';
import Section from '../components/shared/Section';
import Upload from '../components/ImportExcel/Upload';
import Job from '../components/Job';

const AdminView = observer(() => {
    const userStore = useStore('userStore');
    const semesterStore = useStore('semesterStore');
    const viewStore = useStore('viewStore');
    const jobStore = useStore('jobStore');
    const regPeriodStore = useStore('registrationPeriodStore');

    if (!userStore.current?.isAdmin) {
        return (<Layout>
            <main>
                <div className='hero hero--primary'>
                    <div className='container'>
                        <h1 className='hero__title'>Nur für Admins</h1>
                        <p className='hero__subtitle'>Nur für Administratoren zugänglicher Bereich</p>
                    </div>
                </div>
            </main>
        </Layout>)
    }

    return (
        <Layout wrapperClassName={clsx(styles.layout)}>
            <Tabs className={clsx(styles.tabs)} queryString groupId='admin-tab'>
                <TabItem value="users" label="Users" default>
                    <UserTable users={viewStore.adminUserTable.users} />
                </TabItem>
                <TabItem value="semesters" label="Semester">
                    <Section title="Semester">
                        <Button 
                            title='Semester Hinzufügen'
                            text="Neues Semester"
                            iconSide='left'
                            icon={<Icon path={mdiPlusCircleOutline}/>}
                            color='primary'
                            apiState={semesterStore.apiStateFor('create')}
                            onClick={() => {
                                semesterStore.create({
                                    name: 'New', 
                                    start: (new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)).toISOString(),
                                    end: (new Date(Date.now() + 1000 * 60 * 60 * 24 * 270)).toISOString()
                                })
                            }}
                        />
                        <SemesterList />
                    </Section>
                    <SyncUntis />
                </TabItem>
                <TabItem value="departments" label="Abteilungen">
                    <DepartmentTable departments={viewStore.adminDepartmentTable.departments} />
                </TabItem>
                <TabItem value="import" label="Import">
                    <Section
                        title={<span>Excel Import <Icon path={mdiFileExcel} size={2} color={'green'} /></span>}
                        subtitle="Importiere Daten aus Excel-Dateien."
                    >
                        <Upload />
                        <div>
                            {jobStore.importJobs.map((job, idx) => {
                                return (
                                    <Job key={job.id} job={job} />
                                )
                            })}
                        </div>
                    </Section>
                </TabItem>
                <TabItem value="reg-periods" label="Registrierungs Perioden">
                    This is a banana 🍌
                </TabItem>
            </Tabs>

        </Layout>
    )
});

export default AdminView;