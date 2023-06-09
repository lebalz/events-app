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
    const someDepartments = departments.some(d => event.departmentIds.has(d.id));
    const allDepartments = someDepartments && departments.every(d => event.departmentIds.has(d.id));

    return (
        <div className={clsx(styles.departmentClasses)}>
            <div className={clsx(styles.department)}>
                <Button
                    text={'Alle'}
                    active={allDepartments}
                    color={someDepartments ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartments) {
                            departments.forEach(d => event.setDepartmentId(d.id, true));
                        } else {
                            departments.forEach(d => event.setDepartmentId(d.id, false));
                        }
                    }}
                />
                {departments.map((d) => {
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
            {
                Object.keys(klasses).map((year) => {
                    /** MULTIPLE CLASSES PER YEAR */
                    const first = (klasses[year] as Klass[])[0];
                    const groupName = `${year.slice(2)}${first.departmentLetter}`;
                    const some = klasses[year].some(c => event.affectsClass(c));
                    const all = event.classGroups.has(groupName) || (some && klasses[year].every(c => event.affectsClass(c)));
                    const depIds = _.uniq(klasses[year].map(c => c.departmentId));
                    return (
                        <div className={clsx(styles.year)} key={year}>
                            <Button
                                text={year.slice(2)}
                                active={all}
                                color={some ? 'primary' : 'secondary'}
                                onClick={() => {
                                    if (event.classGroups.has(groupName)) {
                                        klasses[year].forEach(c => event.setClass(c.name, false));
                                    } else if (all && depIds.every(did => event.departmentIds.has(did))) {
                                        depIds.forEach(d => event.setDepartmentId(d, false));
                                        klasses[year].forEach(c => event.setClass(c.name, false));
                                    }
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
                                        if (all) {
                                            klasses[year].forEach(c => event.setClass(c.name, true));
                                            if (event.classGroups.has(groupName)) {
                                                event.toggleClassGroup(groupName);
                                            } else if (event.departmentIds.has(kl.departmentId)) {
                                                allKlasses.filter(c => c.departmentId === kl.departmentId).forEach(c => event.setClass(c.name, true));
                                                event.toggleDepartment(kl.departmentId);
                                            }
                                        }
                                        event.toggleClass(kl.name);
                                        if (klasses[year].every(c => event.affectsClass(c))) {
                                            event.toggleClassGroup(groupName);
                                        }
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