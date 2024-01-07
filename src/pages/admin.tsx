import React from 'react';
import clsx from 'clsx';
import styles from './admin.module.scss';
import { observer } from 'mobx-react-lite';
import Layout from '@theme/Layout';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { useStore } from '../stores/hooks';
import SemesterList from '../components/Semester/List';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/icons';
import { mdiFileExcel, mdiPlusCircleOutline } from '@mdi/js';
import UserTable from '../components/Admin/UserTable';
import DepartmentTable from '../components/Admin/DepartmentTable';
import SyncUntis from '../components/Job/SyncUntis';
import Section from '../components/shared/Section';
import Upload from '../components/ImportEvents/Upload';
import Job from '../components/Job';
import Translate, { translate } from '@docusaurus/Translate';
import ImportEvents from '../components/ImportEvents';

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
                        <h1 className='hero__title'>
                            <Translate id="admin.noadmin.titre" description="the title for no administrator">
                                For administrators only
                            </Translate>
                        </h1>
                        <p className='hero__subtitle'>
                            <Translate id="admin.noadmin.text" description="the description text for no admins">
                                Area reserved for administrators
                            </Translate>
                        </p>
                    </div>
                </div>
            </main>
        </Layout>)
    }

    return (
        <Layout wrapperClassName={clsx(styles.layout)}>
            <Tabs className={clsx(styles.tabs)} queryString groupId='admin-tab' lazy>
                <TabItem value="users" label={translate({message: 'Users', id: 'admin.tab.users'})} default>
                    <UserTable users={viewStore.adminUserTable.users} />
                </TabItem>
                <TabItem value="semesters" label={translate({message: 'Semester', id: 'admin.tab.Semester'})}>
                    <Section 
                        title={translate({
                            message : "Semester",
                            id:'admin.section.semester' ,
                            description:'Section Title semester'
                        })}
                    >
                        <Button 
                            title={translate({
                                message : "Semester Hinzufügen",
                                id:'admin.button.semester.hinzufugen.title' ,
                                description:'Button Title Semester Hinzufügen'
                            })}
                            text={translate({
                                message : "Neues Semester",
                                id:'admin.button.semester.hinzufuge.text' ,
                                description:'Button Text Neues Semester'
                            })}
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
                <TabItem value="departments" label={translate({message: 'Abteilungen', id: 'admin.tab.departments'})}>
                    <DepartmentTable />
                </TabItem>
                <TabItem value="import" label={translate({message: 'Import', id: 'admin.tab.import'})}>
                    <ImportEvents />
                </TabItem>
                <TabItem value="reg-periods" label={translate({message: 'Registrierungs Perioden', id: 'admin.tab.reg-periods'})}>
                    🚧 Under construction... 🏗️
                </TabItem>
            </Tabs>

        </Layout>
    )
});

export default AdminView;