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
import { mdiPlusCircleOutline } from '@mdi/js';

const AdminView = observer(() => {
    const semesterStore = useStore('semesterStore');
    const userStore = useStore('userStore');
    const regPeriodStore = useStore('registrationPeriodStore');

    return (
        <Layout>
            <Tabs>
                <TabItem value="users" label="Users" >
                    {
                        userStore.models.map((user, idx) => {
                            return (<div key={idx}>{user.email}</div>);
                        })
                    }
                </TabItem>
                <TabItem value="semesters" label="Semester" default>
                    <Button 
                        title='Semester Hinzufügen'
                        text="Neues Semester"
                        iconSide='left'
                        icon={<Icon path={mdiPlusCircleOutline}/>}
                        className={clsx("button--primary")}
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
                </TabItem>
                <TabItem value="reg-periods" label="Registrierungs Perioden">
                    This is a banana 🍌
                </TabItem>
            </Tabs>

        </Layout>
    )
});

export default AdminView;