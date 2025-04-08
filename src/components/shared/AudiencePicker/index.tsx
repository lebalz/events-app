import React from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';
import { default as EventModel } from '@site/src/models/Event';
import { useStore } from '@site/src/stores/hooks';
import { observer } from 'mobx-react-lite';
import Button from '../Button';
import _ from 'lodash';
import Translate, { translate } from '@docusaurus/Translate';
import AudienceSelector from './AudienceDropdownSelector';
import DepartmentTab from './DepartmentTab';
import { mdiSetAll } from '@mdi/js';
import { SIZE_S } from '../icons';

interface Props {
    event: EventModel;
    className?: string;
}

const AudiencePicker = observer((props: Props) => {
    const { event } = props;
    const departmentStore = useStore('departmentStore');
    const eventStore = useStore('eventStore');
    const userStore = useStore('userStore');
    const { current } = userStore;
    if (!current) {
        return null;
    }

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
                <DepartmentTab
                    departments={departmentStore.groupedByLetter}
                    event={event}
                    className={clsx(styles.tabItems)}
                />
                <AudienceSelector event={event} />
                {!error && event.isDraft && (
                    <div className={clsx(styles.normalize)}>
                        <Button
                            onClick={() => event.normalizeAudience()}
                            apiState={eventStore.apiStateFor(`normalize-audience-${event.id}`)}
                            text={translate({
                                message: 'Redundanzen Entfernen',
                                id: 'audiencePicker.normalize-audience.text'
                            })}
                            icon={mdiSetAll}
                            iconSide="left"
                            color="primary"
                            size={SIZE_S}
                            title={translate({
                                message:
                                    'Entfernt redundante Publikums-Informationen, indem bspw. bereits enthaltene Klassen entfernt werden. Beim Einreichen wird das Publikum automatisch normalisiert.',
                                id: 'audiencePicker.normalize-audience.title'
                            })}
                        />
                    </div>
                )}
                {error && <div className={clsx(styles.errorMessage)}>{error.message}</div>}
            </div>
        </div>
    );
});

export default AudiencePicker;
