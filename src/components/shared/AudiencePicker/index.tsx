
import React, { KeyboardEventHandler }  from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { default as DepartmentModel } from '@site/src/models/Department';
import Department from './Department';
import Checkbox from '../Checkbox';
import Button from '../Button';
import _ from 'lodash';
import { KlassName } from '@site/src/models/helpers/klassNames';
import ClassSelector from './ClassSelector';



interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null
    };

    const departments = departmentStore.groupedByLetter;
    const { event } = props;
    const { 
        someDepartments, 
        allDepartments, 
        allDepartmentsDe, 
        allDepartmentsFr, 
        someDepartmentsDe, 
        someDepartmentsFr 
    } = event.departmentState;

    return (
        <div className={clsx(styles.audience)}>
            <div className={clsx(styles.header)}>
                <Checkbox checked={event.teachersOnly} onChange={(checked) => event.setTeachersOnly(checked)} label='Nur LP' />
                <Checkbox checked={event.klpOnly} onChange={(checked) => event.setKlpOnly(checked)} label='Nur KLP' disabled={event.teachersOnly} />
            </div>
            <div className={clsx(styles.header)}>
                <Button
                    text={'Alle Schulen'}
                    active={allDepartments}
                    color={someDepartments ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartments) {
                            departmentStore.departments.forEach(d => event.setDepartment(d, true));
                        } else {
                            departmentStore.departments.forEach(d => event.setDepartment(d, false));
                        }
                    }}
                />
                <Button
                    text={'GBSL'}
                    active={allDepartmentsDe}
                    color={someDepartmentsDe ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartmentsDe) {
                            departmentStore.departmentsDe.forEach(d => event.setDepartment(d, true));
                        } else {
                            departmentStore.departmentsDe.forEach(d => event.setDepartment(d, false));
                        }
                    }}
                />
                <Button
                    text={'GBJB'}
                    active={allDepartmentsFr}
                    color={someDepartmentsFr ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartmentsFr) {
                            departmentStore.departmentsFr.forEach(d => event.setDepartment(d, true));
                        } else {
                            departmentStore.departmentsFr.forEach(d => event.setDepartment(d, false));
                        }
                    }}
                />
            </div>
            <Tabs className={clsx(styles.tabs)}>
                {Object.keys(departments).sort().map((letter, idx) => {
                    const color = (departments[letter] as DepartmentModel[])[0].color
                    const touched = (departments[letter] as DepartmentModel[]).some(d => d.classes.some(c => event.affectsClass(c)));
                    return (
                        // @ts-ignore
                        <TabItem value={letter} label={departmentStore.letterToName(letter)} key={letter} attributes={{className: clsx(touched && styles.touched), style: {color: color}}}>
                            <Department departments={departments[letter]} event={event} />
                        </TabItem>
                    )
                })}
            </Tabs>
            <ClassSelector event={event} />
        </div>
    )
});

export default AudiencePicker;