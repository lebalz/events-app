import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { default as DepartmentModel } from '@site/src/models/Department';
import Department from './Department';
import Button from '../Button';
import _ from 'lodash';
import Translate, { translate } from '@docusaurus/Translate';
import Info from '../../Event/EventFields/AudienceOptions/Info';
import AudienceSelector from './AuienceDropdownSelector';

interface Props {
    event: EventModel;
    className?: string;
}

const AudiencePicker = observer((props: Props) => {
    const departmentStore = useStore('departmentStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null;
    }

    const departments = departmentStore.groupedByLetter;
    const { event } = props;
    const error = event.errorFor('audience');
    const {
        someDepartments,
        allDepartments,
        allDepartmentsDe,
        allDepartmentsFr,
        someDepartmentsDe,
        someDepartmentsFr
    } = event.departmentState;

    return (
        <div className={clsx(styles.audience, props.className)}>
            <div className={clsx(error && styles.error)}>
                <h4>
                    <Translate
                        id="shared.header.school_departement"
                        description="The title in the window for the event."
                    >
                        Schulen/Klassen
                    </Translate>
                </h4>
                <AudienceSelector event={event} />
                <div className={clsx(styles.flex)}>
                    <Button
                        text={translate({
                            message: 'Alle Schulen',
                            description: 'Button text to toggle all schools on/off',
                            id: 'shared.AudiencePicker'
                        })}
                        active={allDepartments}
                        color={someDepartments ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (!allDepartments) {
                                departmentStore.departments.forEach((d) => event.setDepartment(d, true));
                            } else {
                                departmentStore.departments.forEach((d) => event.setDepartment(d, false));
                            }
                        }}
                    />
                    <Button
                        text={'GBSL'}
                        active={allDepartmentsDe}
                        color={someDepartmentsDe ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (!allDepartmentsDe) {
                                departmentStore.departmentsDe.forEach((d) => event.setDepartment(d, true));
                            } else {
                                departmentStore.departmentsDe.forEach((d) => event.setDepartment(d, false));
                            }
                        }}
                    />
                    <Button
                        text={'GBJB'}
                        active={allDepartmentsFr}
                        color={someDepartmentsFr ? 'primary' : 'secondary'}
                        onClick={() => {
                            if (!allDepartmentsFr) {
                                departmentStore.departmentsFr.forEach((d) => event.setDepartment(d, true));
                            } else {
                                departmentStore.departmentsFr.forEach((d) => event.setDepartment(d, false));
                            }
                        }}
                    />
                </div>
                <Tabs className={clsx(styles.tabs)} lazy>
                    {Object.keys(departments)
                        .sort()
                        .map((letter, idx) => {
                            const color = (departments[letter] as DepartmentModel[])[0].color;
                            const touched = (departments[letter] as DepartmentModel[]).some((d) =>
                                d.classes.some((c) => event.affectsClass(c))
                            );
                            return (
                                <TabItem
                                    value={letter}
                                    label={departmentStore.letterToName(letter)}
                                    key={letter}
                                    attributes={{
                                        className: clsx(touched && styles.touched),
                                        style: { color: color }
                                    }}
                                >
                                    <Department departments={departments[letter]} event={event} />
                                </TabItem>
                            );
                        })}
                </Tabs>
                {error && <div className={clsx(styles.errorMessage)}>{error.message}</div>}
            </div>
        </div>
    );
});

export default AudiencePicker;
