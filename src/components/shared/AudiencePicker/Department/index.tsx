import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { observer } from 'mobx-react-lite';
import { default as DepartmentModel } from '@site/src/models/Department';
import Klass from '@site/src/models/Untis/Klass';
import { default as EventModel } from '@site/src/models/Event';
import { translate } from '@docusaurus/Translate';
import Button from '../../Button';
import _ from 'lodash';
import GraduationYear from './GraduationYear';
interface Props {
    event: EventModel;
    departments: DepartmentModel[];
}

const Department = observer((props: Props) => {
    const { event } = props;
    const departments = props.departments.filter((d) => d.classes.length > 0);
    const allKlasses = departments.map((d) => d.classes).flat();
    const klasses = _.groupBy(allKlasses, (c) => c.year);
    const someDepartments = departments.some((d) => event.departmentIds.has(d.id));
    const allDepartments = someDepartments && departments.every((d) => event.departmentIds.has(d.id));

    return (
        <div className={clsx(styles.departmentClasses)}>
            <div className={clsx(styles.department)}>
                <Button
                    text={translate({
                        message: 'Alle',
                        description: 'toggle all departments',
                        id: 'shared.AudiencePicker.Department'
                    })}
                    active={allDepartments}
                    color={someDepartments ? 'primary' : 'secondary'}
                    onClick={() => {
                        if (!allDepartments) {
                            departments.forEach((d) => event.setDepartment(d, true));
                        } else {
                            departments.forEach((d) => event.setDepartment(d, false));
                        }
                    }}
                />
                {departments.map((d) => {
                    return (
                        <Button
                            key={d.id}
                            text={d.name}
                            active={event.departmentIds.has(d.id)}
                            color={d.color}
                            onClick={() => event.toggleDepartment(d)}
                        />
                    );
                })}
            </div>
            {Object.values(klasses).map((klasses) => {
                return <GraduationYear event={event} klasses={klasses} key={klasses[0].year} />;
            })}
        </div>
    );
});

export default Department;
