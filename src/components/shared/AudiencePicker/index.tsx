
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
import ClassSelector from './ClassSelector';
import Translate, { translate } from '@docusaurus/Translate';
import { EventAudience, TeachingAffected } from '@site/src/api/event';
import { mdiDotsHorizontalCircleOutline } from '@mdi/js';



interface Props {
    event: EventModel;
}

const TranslationsTA: { [key in TeachingAffected]: string } = {
    [TeachingAffected.YES]: translate({ message: 'Ja', description: 'Yes, the teaching is affected and the class is not present', id: 'TeachingAffected.YES.description' }),
    [TeachingAffected.NO]: translate({ message: 'Nein', description: 'No, the teaching happens as usual', id: 'TeachingAffected.NO.description' }),
    [TeachingAffected.PARTIAL]: translate({ message: 'Teilweise', description: 'Only a part of the class will be present', id: 'TeachingAffected.PARTIAL.description' })
}

const TranslationsEA: { [key in EventAudience]: string } = {
    [EventAudience.ALL]: translate({ message: 'Alle', description: 'This event is for everyone, no matter wheter a lesson is affected or not', id: 'EventAudience.ALL.description' }),
    [EventAudience.KLP]: translate({ message: 'KLP', description: 'Only relevant (and displayed) for class teachers', id: 'EventAudience.KLP.description' }),
    [EventAudience.LP]: translate({ message: 'LP', description: 'Only relevant for teachers affected of this class (no matter wheter a lesson is affected or not)', id: 'EventAudience.LP.description' }),
    [EventAudience.STUDENTS]: translate({ message: 'SuS', description: 'Relevant for SuS only, their KLP will be informed aswell', id: 'EventAudience.STUDENTS.description' })
}

const AudiencePicker = observer((props: Props) => {
    const [showOptions, setShowOptions] = React.useState(false);
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
            <div className={clsx(styles.affects)}>
                <h4>Betrifft</h4>
                <div className={styles.toggle}>
                    <span className={styles.label}>Betrifft</span>
                    <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                        {Object.keys(EventAudience).map(audience => {
                            return (<Button
                                text={TranslationsEA[audience]}
                                onClick={() => event.update({ audience: EventAudience[audience] })}
                                active={event.audience === audience}
                                key={audience}
                            />)
                        })}
                    </div>
                </div>
                <div className={styles.toggle}>
                    <span className={styles.label}>Unterricht Betroffen?</span>
                    <div className={clsx(styles.buttonGroup, 'button-group', 'button-group--block')}>
                        {Object.keys(TeachingAffected).map(affected => {
                            return (<Button
                                text={TranslationsTA[affected]}
                                onClick={() => event.update({ teachingAffected: TeachingAffected[affected] })}
                                active={event.teachingAffected === affected}
                                key={affected}
                            />)
                        })}
                    </div>
                </div>
            </div>
            <h4>Schulen/Klassen</h4>
            <div className={clsx(styles.flex)}>
                <Button
                    text={translate({ message: 'Alle Schulen', description: 'Button text to toggle all schools on/off', id: 'shared.AudiencePicker' })}
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
            <Tabs className={clsx(styles.tabs)} lazy>
                {Object.keys(departments).sort().map((letter, idx) => {
                    const color = (departments[letter] as DepartmentModel[])[0].color
                    const touched = (departments[letter] as DepartmentModel[]).some(d => d.classes.some(c => event.affectsClass(c)));
                    return (
                        // @ts-ignore
                        <TabItem value={letter} label={departmentStore.letterToName(letter)} key={letter} attributes={{ className: clsx(touched && styles.touched), style: { color: color } }}>
                            <Department departments={departments[letter]} event={event} />
                        </TabItem>
                    )
                })}
            </Tabs>
            <div className={clsx(styles.options)}>
                <Button
                    icon={mdiDotsHorizontalCircleOutline}
                    title='Erweitert'
                    onClick={() => setShowOptions(!showOptions)}
                    className={clsx(styles.optionsBtn, (showOptions || event.unknownClassIdentifiers.length > 0) && styles.showOptions)}
                />
                {
                    (showOptions ||event.unknownClassIdentifiers.length > 0) && (
                        <div>
                            <h4><Translate>Künftige Klassen</Translate></h4>
                            <ClassSelector event={event} />
                        </div>
                    )
                }
            </div>
        </div>
    )
});

export default AudiencePicker;