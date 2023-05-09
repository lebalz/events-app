
import React from 'react';
import clsx from 'clsx';

import styles from './cstyles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { DepartmentLetter, Letter2Name } from '@site/src/api/department';
import { default as DepartmentModel } from '@site/src/models/Department';
import Department from './department';
import Toggle from './Toggle';
import Checkbox from '../Checkbox';
import Button from '../Button';


interface Props {
    event: EventModel;
}

const AudiencePicker = observer((props: Props) => {
    const [expanded, setExpanded] = React.useState<string[]>([]);
    const [open, setOpen] = React.useState(true);
    const untisStore = useStore('untisStore');
    const departmentStore = useStore('departmentStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null
    };

    const departments: { [letter in DepartmentLetter]?: DepartmentModel[] } = {}

    Object.values(DepartmentLetter).forEach((letter) => {
        const deps = departmentStore.findByDepartmentLetter(letter).filter(d => d.classes.length > 0);
        if (deps.length > 0) {
            departments[letter] = deps;
        }
    })
    const { event } = props;

    return (
        <div className={clsx(styles.audience)}>
            <div className={clsx(styles.header)}>
                <Checkbox checked={event.allLPs} onChange={(checked) => event.setAllLPs(checked)} label='Alle LP' />
                {!event.allLPs && (
                    <>
                        <Checkbox checked={event.teachersOnly} onChange={(checked) => event.setTeachersOnly(checked)} label='Nur LP' />
                        <Checkbox checked={event.klpOnly} onChange={(checked) => event.setKlpOnly(checked)} label='Nur KLP' disabled={event.teachersOnly} />
                    </>
                )}
            </div>
            {event.allLPs ? (
                <div className={clsx(styles.department)}>
                    {departmentStore.departments.map((d) => {
                        return (
                            <Button
                                key={d.id}
                                text={d.name}
                                active={event.departmentIds.has(d.id)}
                                color={event.departmentIds.has(d.id) ? 'primary' : 'secondary'}
                                onClick={() => event.toggleDepartment(d.id)}
                            />
                        )
                    })}
                </div>
            ) : (
                // @ts-ignore
                <Tabs className={clsx(styles.tabs)}>
                    {Object.keys(departments).map((letter, idx) => {
                        return (
                            // @ts-ignore
                            <TabItem value={letter} label={Letter2Name[letter]} key={letter}>
                                <Department departments={departments[letter]} event={event} />
                            </TabItem>
                        )
                    })}
                </Tabs>
            )}
        </div>
    )
});

export default AudiencePicker;