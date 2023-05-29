import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as DepartmentModel } from '@site/src/models/Department';
import Klass from '@site/src/models/Untis/Klass';
import { default as EventModel } from '@site/src/models/Event';
import Button from '../Button';


interface Props {
    event: EventModel;
    departments: DepartmentModel[]
}

const Department = observer((props: Props) => {
    const { departments, event } = props;
    const klasses: { [year: number]: Klass[] } = {};
    departments.map(d => d.classes).flat().forEach((c) => {
        if (!klasses[c.graduationYear]) {
            klasses[c.graduationYear] = [];
        }
        klasses[c.graduationYear] = [...klasses[c.graduationYear], c].sort((a, b) => a.letter.localeCompare(b.letter));
    })
    return (
        <div className={clsx(styles.departmentClasses)}>{
            Object.keys(klasses).map((year) => {
                /** MULTIPLE CLASSES PER YEAR */
                const first = (klasses[year] as Klass[])[0];
                const groupName = `${year.slice(2)}${first.departmentLetter}`;
                const some = klasses[year].some(c => event.affectsClass(c));
                const all = event.classGroups.has(groupName);
                return (<div className={clsx(styles.year)} key={year}>
                    <Button 
                        text={year.slice(2)} 
                        active={all}
                        color={some ? 'primary' : 'secondary'}
                        onClick={() => {
                            event.toggleClassGroup(groupName);
                            // if (all) {

                            //     klasses[year].forEach(c => {
                            //         event.toggleClass(c.name)
                            //     })
                            // } else {
                            //     klasses[year].forEach(c => {
                            //         if (!event.isAudience(c.name)) {
                            //             event.toggleClass(c.name)
                            //         }
                            //     })
                            // }
                        }}
                    />
                    {klasses[year].map((kl: Klass) => {
                        return (<Button
                            key={kl.id}
                            color={kl.department.color}
                            active={event.affectsClass(kl)}
                            text={kl.letter}
                            title={kl.displayName}
                            onClick={() => event.toggleClass(kl.name)}
                        />)
                    })}
                </div>);
            })
        }</div>
    )
});

export default Department;