import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import Button from '../../shared/Button';
import { mdiMinusCircleOutline, mdiPlusCircleOutline } from '@mdi/js';
import TextInput from '../../shared/TextInput';
import DatePicker from '../../shared/DatePicker';

interface Props {
}

const Filter = observer((props: Props) => {
    const viewStore = useStore('viewStore');
    const departmentStore = useStore('departmentStore');
    const {eventTable} = viewStore;
    return (
        <div className={clsx(styles.filter)}>
            <div className={clsx(styles.department)}>
                {departmentStore.usedDepartments.map((department) => (
                    <Button 
                        text={department.name}
                        className={clsx(eventTable.departmentIds.has(department.id) && styles.selected)}
                        onClick={() => eventTable.toggleDepartment(department.id)} 
                        key={department.id}
                    />
                ))}
            </div>
            <div className={clsx(styles.classes)}>
                <TextInput onChange={(txt) => eventTable.setClassFilter(txt)} text={eventTable.klassFilter}/>
            </div>
            <div className={clsx(styles.date, styles.start)}>
                {!!eventTable.start ? (
                    <>
                        <DatePicker date={eventTable.start || new Date()} onChange={(date)=>eventTable.setStartFilter(date)} />
                        <Button icon={mdiMinusCircleOutline} iconSide='left' text='Start' onClick={() => eventTable.setStartFilter(null)}/>
                    </>
                ) : (
                    <Button icon={mdiPlusCircleOutline} iconSide='left' text='Start' onClick={() => eventTable.setStartFilter(new Date())}/>
                )}
            </div>
            <div className={clsx(styles.date, styles.end)}>
                {!!eventTable.end ? (
                    <>
                        <DatePicker date={eventTable.end || new Date()} onChange={(date)=>eventTable.setEndFilter(date)} />
                        <Button icon={mdiMinusCircleOutline} iconSide='left' text='Ende' onClick={() => eventTable.setEndFilter(null)}/>
                    </>
                ) : (
                    <Button icon={mdiPlusCircleOutline} iconSide='left' text='Ende' onClick={() => eventTable.setEndFilter(new Date())}/>
                )}
            </div>
        </div>
    )
});

export default Filter;