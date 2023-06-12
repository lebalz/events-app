import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '@site/src/stores/hooks';
import { default as DepartmentModel } from '@site/src/models/Department';
import Klass from '@site/src/models/Untis/Klass';
import { default as EventModel } from '@site/src/models/Event';
import Button from '../Button';
import _ from 'lodash';
interface Props {
    event: EventModel;
    departments: DepartmentModel[]
}

const Department = observer((props: Props) => {
    const { departments, event } = props;
    const allKlasses = departments.map(d => d.classes).flat();
    const klasses = _.groupBy(allKlasses, c => c.year);
    const { someDepartments, allDepartments } = event.departmentState;

    return (
        <div className={clsx(styles.departmentClasses)}>
            <div className={clsx(styles.department)}>
                <Button
                    text={'Alle'}
                    active={allDepartments}
                    color={someDepartments ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartments) {
                            departments.forEach(d => event.setDepartment(d, true));
                        } else {
                            departments.forEach(d => event.setDepartment(d, false));
                        }
                    }}
                />
                {departments.filter(d => d.classes.length > 0).map((d) => {
                    return (
                        <Button
                            key={d.id}
                            text={d.name}
                            active={event.departmentIds.has(d.id)}
                            color={event.departmentIds.has(d.id) ? 'primary' : 'secondary'}
                            onClick={() => event.toggleDepartment(d)}
                        />
                    )
                })}
            </div>
            {
                Object.keys(klasses).map((year) => {
                    /** MULTIPLE CLASSES PER YEAR */
                    const first = (klasses[year] as Klass[])[0];
                    const groupName = `${year.slice(2)}${first.departmentLetter}`;
                    const some = klasses[year].some(c => event.affectsClass(c));
                    const all = event.classGroups.has(groupName) || (some && klasses[year].every(c => event.affectsClass(c)));
                    return (
                        <div className={clsx(styles.year)} key={year}>
                            <Button
                                text={year.slice(2)}
                                active={all}
                                color={some ? 'primary' : 'secondary'}
                                onClick={() => {
                                    event.toggleClassGroup(groupName);
                                }}
                            />
                            {_.sortBy(klasses[year], ['letter']).map((kl: Klass) => {
                                return (<Button
                                    key={kl.id}
                                    color={kl.department?.color}
                                    active={event.affectsClass(kl)}
                                    text={kl.letter}
                                    title={`${kl.displayName} (${kl.name}) ${kl.department?.name}`}
                                    onClick={() => {
                                        event.toggleClass(kl.name);
                                    }}
                                />)
                            })}
                        </div>
                    );
                })
            }
        </div>
    )
});

export default Department;